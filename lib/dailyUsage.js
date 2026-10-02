// lib/dailyUsage.js

import clientPromise from "@/lib/mongodb";
import { getPlanConfig } from "@/lib/planConfig";

const DB_NAME = "aurafit";
const USERS_COLLECTION = "users";

// --------------------------------------------------
// INDIA DATE
// Daily quota India calendar ke according chalega.
// --------------------------------------------------

function getTodayIST() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// --------------------------------------------------
// GET USER PLAN
// Ye hi CENTRAL source hai current subscription plan ka.
// --------------------------------------------------

async function getUserPlan(email) {
  if (!email) {
    return {
      plan: "free",
      config: getPlanConfig("free"),
      user: null,
    };
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const user = await db
    .collection(USERS_COLLECTION)
    .findOne({ email });

  // User nahi mila
  if (!user) {
    return {
      plan: "free",
      config: getPlanConfig("free"),
      user: null,
    };
  }

  // ------------------------------------------------
  // ONLY user.plan is used as subscription source
  // ------------------------------------------------

  let plan = String(user.plan || "free").toLowerCase();

  // ------------------------------------------------
  // Validate plan
  // ------------------------------------------------

  const validPlans = ["free", "weekly", "monthly", "yearly"];

  if (!validPlans.includes(plan)) {
    plan = "free";
  }

  // ------------------------------------------------
  // CHECK SUBSCRIPTION EXPIRY
  // ------------------------------------------------

  if (
    plan !== "free" &&
    user.subscriptionExpiryDate &&
    new Date() >= new Date(user.subscriptionExpiryDate)
  ) {
    plan = "free";

    await db.collection(USERS_COLLECTION).updateOne(
      { email },
      {
        $set: {
          plan: "free",
          membership: "Free Plan",
          subscriptionStatus: "expired",
        },
      }
    );
  }

  return {
    plan,
    config: getPlanConfig(plan),
    user,
  };
}

// --------------------------------------------------
// GET CURRENT DAILY USAGE
// --------------------------------------------------

export async function getDailyUsage(email) {
  const today = getTodayIST();

  // IMPORTANT:
  // Plan aur config hamesha same central function se aayega.
  const { plan, config } = await getUserPlan(email);

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const user = await db.collection(USERS_COLLECTION).findOne(
    { email },
    {
      projection: {
        dailyUsage: 1,
      },
    }
  );

  // ------------------------------------------------
  // Agar aaj ka usage hai to use karo.
  // Warna fresh day = 0 usage.
  // ------------------------------------------------

  const usage =
    user?.dailyUsage?.date === today
      ? user.dailyUsage
      : {
          date: today,
          foodScans: 0,
          bodyScans: 0,
          aiChats: 0,
        };

  return {
    date: today,

    // CENTRAL PLAN
    plan,

    // CURRENT USAGE
    foodScans: usage.foodScans || 0,
    bodyScans: usage.bodyScans || 0,
    aiChats: usage.aiChats || 0,

    // PLAN LIMITS
    limits: {
      foodScans: config.foodScansPerDay,
      bodyScans: config.bodyScansPerDay,
      aiChats: config.aiChatsPerDay,
    },

    // REMAINING
    remaining: {
      foodScans: Math.max(
        0,
        config.foodScansPerDay - (usage.foodScans || 0)
      ),

      bodyScans: Math.max(
        0,
        config.bodyScansPerDay - (usage.bodyScans || 0)
      ),

      aiChats: Math.max(
        0,
        config.aiChatsPerDay - (usage.aiChats || 0)
      ),
    },

    // PLAN FEATURES
    features: {
      name: config.name,
      ads: config.ads,
      analytics: config.analytics,
      personalCoach: config.personalCoach,
      proAnalytics: config.proAnalytics,
      vipAnalytics: config.vipAnalytics,
      seasonalChallenges: config.seasonalChallenges,
      earlyAiAccess: config.earlyAiAccess,
    },
  };
}

// --------------------------------------------------
// CONSUME DAILY QUOTA
//
// feature:
// "foodScan"
// "bodyScan"
// "aiChat"
// --------------------------------------------------

export async function consumeDailyQuota(email, feature) {
  if (!email) {
    return {
      allowed: false,
      reason: "AUTH_REQUIRED",
    };
  }

  const featureMap = {
    foodScan: {
      usageField: "foodScans",
      limitKey: "foodScansPerDay",
    },

    bodyScan: {
      usageField: "bodyScans",
      limitKey: "bodyScansPerDay",
    },

    aiChat: {
      usageField: "aiChats",
      limitKey: "aiChatsPerDay",
    },
  };

  const selectedFeature = featureMap[feature];

  if (!selectedFeature) {
    throw new Error(`Invalid quota feature: ${feature}`);
  }

  const { usageField, limitKey } = selectedFeature;

  // IMPORTANT:
  // Same CENTRAL plan system.
  const { plan, config } = await getUserPlan(email);

  const limit = config[limitKey];

  const today = getTodayIST();

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const users = db.collection(USERS_COLLECTION);

  // ------------------------------------------------
  // ATOMIC QUOTA CHECK + INCREMENT
  //
  // New day:
  // usage reset + current request consume
  //
  // Same day:
  // increment only if limit available
  // ------------------------------------------------

  const result = await users.findOneAndUpdate(
    {
      email,

      $or: [
        {
          "dailyUsage.date": {
            $ne: today,
          },
        },

        {
          [`dailyUsage.${usageField}`]: {
            $lt: limit,
          },
        },
      ],
    },

    [
      {
        $set: {
          dailyUsage: {
            $cond: [
              {
                $ne: ["$dailyUsage.date", today],
              },

              // ------------------------------------
              // NEW DAY
              // ------------------------------------

              {
                date: today,

                foodScans:
                  usageField === "foodScans" ? 1 : 0,

                bodyScans:
                  usageField === "bodyScans" ? 1 : 0,

                aiChats:
                  usageField === "aiChats" ? 1 : 0,
              },

              // ------------------------------------
              // SAME DAY
              // ------------------------------------

              {
                date: today,

                foodScans: {
                  $cond: [
                    {
                      $eq: [usageField, "foodScans"],
                    },

                    {
                      $add: [
                        {
                          $ifNull: [
                            "$dailyUsage.foodScans",
                            0,
                          ],
                        },
                        1,
                      ],
                    },

                    {
                      $ifNull: [
                        "$dailyUsage.foodScans",
                        0,
                      ],
                    },
                  ],
                },

                bodyScans: {
                  $cond: [
                    {
                      $eq: [usageField, "bodyScans"],
                    },

                    {
                      $add: [
                        {
                          $ifNull: [
                            "$dailyUsage.bodyScans",
                            0,
                          ],
                        },
                        1,
                      ],
                    },

                    {
                      $ifNull: [
                        "$dailyUsage.bodyScans",
                        0,
                      ],
                    },
                  ],
                },

                aiChats: {
                  $cond: [
                    {
                      $eq: [usageField, "aiChats"],
                    },

                    {
                      $add: [
                        {
                          $ifNull: [
                            "$dailyUsage.aiChats",
                            0,
                          ],
                        },
                        1,
                      ],
                    },

                    {
                      $ifNull: [
                        "$dailyUsage.aiChats",
                        0,
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ],

    {
      returnDocument: "after",
    }
  );

  // --------------------------------------------------
  // LIMIT REACHED
  // --------------------------------------------------

  if (!result) {
    const usage = await getDailyUsage(email);

    const used =
      feature === "foodScan"
        ? usage.foodScans
        : feature === "bodyScan"
        ? usage.bodyScans
        : usage.aiChats;

    return {
      allowed: false,
      reason: "DAILY_LIMIT_REACHED",

      plan,

      feature,

      limit,

      used,

      remaining: 0,

      date: today,
    };
  }

  // --------------------------------------------------
  // SUCCESS
  // --------------------------------------------------

  const updatedUser = result;

  const updatedUsage = updatedUser.dailyUsage || {};

  const used = updatedUsage[usageField] || 0;

  return {
    allowed: true,

    plan,

    feature,

    limit,

    used,

    remaining: Math.max(0, limit - used),

    date: today,
  };
}