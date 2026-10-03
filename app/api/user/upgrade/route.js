import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      plan,
      membership,
      paymentId,
    } = body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !plan) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and plan are required",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // DATABASE
    // ==========================================

    const client = await clientPromise;
    const db = client.db("aurafit");

    const now = new Date();

    const normalizedPlan = String(plan)
      .trim()
      .toLowerCase();

    // ==========================================
    // FREE PLAN
    // ==========================================

    if (normalizedPlan === "free") {
      await db.collection("users").updateOne(
        { email },
        {
          $set: {
            plan: "free",

            membership: "Free Plan",

            subscriptionStatus: "free",

            subscriptionStartDate: null,

            subscriptionExpiryDate: null,

            subscriptionChatsUsed: 0,

            updatedAt: now,
          },
        },
        {
          upsert: true,
        }
      );

      return NextResponse.json({
        success: true,

        plan: "free",

        // Free = 5 AI chats/day
        remainingChats: 5,
      });
    }

    // ==========================================
    // PAID PLAN CONFIG
    // ==========================================

    const plans = {
      weekly: {
        durationDays: 7,
        aiChatsPerDay: 20,
      },

      monthly: {
        durationDays: 30,
        aiChatsPerDay: 30,
      },

      yearly: {
        durationDays: 365,
        aiChatsPerDay: 100,
      },
    };

    const selectedPlan = plans[normalizedPlan];

    // ==========================================
    // INVALID PLAN
    // ==========================================

    if (!selectedPlan) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid subscription plan",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // SUBSCRIPTION EXPIRY
    // ==========================================

    const expiry = new Date(now);

    expiry.setDate(
      expiry.getDate() +
        selectedPlan.durationDays
    );

    // ==========================================
    // SAVE PLAN + RESET DAILY USAGE
    // ==========================================
    //
    // IMPORTANT:
    //
    // Agar user Free plan me 5/5 chats use
    // kar chuka hai aur Weekly buy karta hai,
    // to usko fresh 20 chats milengi.
    //
    // Free ke 5 chats paid plan ki 20 chats
    // me subtract nahi hongi.
    //
    // Same rule:
    //
    // Weekly  -> Monthly
    // Monthly -> Yearly
    //
    // New plan ko fresh daily quota milega.
    // ==========================================

    const updateResult =
      await db.collection("users").updateOne(
        { email },

        {
          $set: {
            // ----------------------------------
            // NEW PLAN
            // ----------------------------------

            plan: normalizedPlan,

            membership:
              membership ||
              `${normalizedPlan} Plan`,

            subscriptionStatus: "active",

            // ----------------------------------
            // SUBSCRIPTION DATES
            // ----------------------------------

            subscriptionStartDate: now,

            subscriptionExpiryDate: expiry,

            // ----------------------------------
            // RESET OLD SUBSCRIPTION CHAT USAGE
            // ----------------------------------

            subscriptionChatsUsed: 0,

            // ----------------------------------
            // RESET DAILY USAGE
            //
            // This is the important fix.
            // ----------------------------------

            dailyUsage: {
              date: new Intl.DateTimeFormat(
                "en-CA",
                {
                  timeZone: "Asia/Kolkata",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }
              ).format(now),

              foodScans: 0,

              bodyScans: 0,

              aiChats: 0,
            },

            // ----------------------------------
            // RAZORPAY PAYMENT
            // ----------------------------------

            razorpayPaymentId:
              paymentId || null,

            updatedAt: now,
          },
        },

        {
          upsert: true,
        }
      );

    // ==========================================
    // VERIFY DATABASE WRITE
    // ==========================================

    if (!updateResult.acknowledged) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Subscription could not be saved",
        },
        {
          status: 500,
        }
      );
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      plan: normalizedPlan,

      membership:
        membership ||
        `${normalizedPlan} Plan`,

      // Current plan AI chat limit
      chatLimit:
        selectedPlan.aiChatsPerDay,

      // Fresh quota after upgrade
      remainingChats:
        selectedPlan.aiChatsPerDay,

      subscriptionStartDate: now,

      subscriptionExpiryDate: expiry,
    });
  } catch (error) {
    console.error(
      "Upgrade API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to activate subscription",
      },
      {
        status: 500,
      }
    );
  }
}