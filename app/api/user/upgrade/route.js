import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  webhookKey: process.env.DODO_WEBHOOK_SECRET,
  environment: "test_mode",
});

// ==========================================
// TEST MODE PRODUCT → PLAN MAPPING
// ==========================================

const PRODUCT_PLANS = {
  [process.env.DODO_WEEKLY_PRODUCT_ID]: {
    plan: "weekly",
    durationDays: 7,
    aiChatsPerDay: 20,
  },

  [process.env.DODO_MONTHLY_PRODUCT_ID]: {
    plan: "monthly",
    durationDays: 30,
    aiChatsPerDay: 30,
  },

  [process.env.DODO_YEARLY_PRODUCT_ID]: {
    plan: "yearly",
    durationDays: 365,
    aiChatsPerDay: 100,
  },
};

// ==========================================
// WEBHOOK
// ==========================================

export async function POST(req) {
  try {
    // ------------------------------------------
    // RAW BODY
    // ------------------------------------------

    const rawBody = await req.text();

    // ------------------------------------------
    // DODO WEBHOOK HEADERS
    // ------------------------------------------

    const headers = {
      "webhook-id": req.headers.get("webhook-id"),
      "webhook-signature": req.headers.get(
        "webhook-signature"
      ),
      "webhook-timestamp": req.headers.get(
        "webhook-timestamp"
      ),
    };

    // ------------------------------------------
    // VERIFY WEBHOOK
    // ------------------------------------------

    const event = dodo.webhooks.unwrap(rawBody, {
      headers,
    });

    console.log(
      "=========================================="
    );

    console.log(
      "✅ DODO TEST WEBHOOK:",
      event.type
    );

    console.log(
      "=========================================="
    );

    // ==========================================
    // SUBSCRIPTION ACTIVE
    // ==========================================

    if (event.type === "subscription.active") {
      const data = event.data || {};

      console.log(
        "📦 Subscription Active Data:"
      );

      console.log(
        JSON.stringify(data, null, 2)
      );

      // ------------------------------------------
      // CUSTOMER EMAIL
      // ------------------------------------------

      const metadata = data.metadata || {};

      const email =
        metadata.user_email ||
        data.customer?.email ||
        data.customer_email;

      if (!email) {
        console.error(
          "❌ Customer email missing"
        );

        return NextResponse.json(
          {
            success: false,
            error: "Customer email missing",
          },
          {
            status: 400,
          }
        );
      }

      // ------------------------------------------
      // PRODUCT ID
      // ------------------------------------------

      const productId =
        data.product_id ||
        data.product?.id;

      console.log(
        "🛒 Dodo Product ID:",
        productId
      );

      // ------------------------------------------
      // FIND PLAN
      // ------------------------------------------

      const planConfig =
        PRODUCT_PLANS[productId];

      if (!planConfig) {
        console.error(
          "❌ Unknown Dodo product:",
          productId
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unknown Dodo product",
            productId,
          },
          {
            status: 400,
          }
        );
      }

      console.log(
        "💎 Plan:",
        planConfig.plan
      );

      // ------------------------------------------
      // DATABASE
      // ------------------------------------------

      const client =
        await clientPromise;

      const db =
        client.db("aurafit");

      // ------------------------------------------
      // DATES
      // ------------------------------------------

      const now = new Date();

      const expiry =
        new Date(now);

      expiry.setDate(
        expiry.getDate() +
          planConfig.durationDays
      );

      // ------------------------------------------
      // INDIA DATE
      // ------------------------------------------

      const indiaDate =
        new Intl.DateTimeFormat(
          "en-CA",
          {
            timeZone:
              "Asia/Kolkata",

            year: "numeric",

            month: "2-digit",

            day: "2-digit",
          }
        ).format(now);

      // ------------------------------------------
      // SAVE USER
      // ------------------------------------------

      const result =
        await db
          .collection("users")
          .updateOne(
            {
              email,
            },

            {
              $set: {
                // ------------------------------
                // PLAN
                // ------------------------------

                plan:
                  planConfig.plan,

                membership:
                  `${planConfig.plan
                    .charAt(0)
                    .toUpperCase()}${planConfig.plan.slice(
                    1
                  )} Plan`,

                // ------------------------------
                // PRO STATUS
                // ------------------------------

                isPro: true,

                subscriptionStatus:
                  "active",

                // ------------------------------
                // DATES
                // ------------------------------

                subscriptionStartDate:
                  now,

                subscriptionExpiryDate:
                  expiry,

                // ------------------------------
                // CHAT USAGE
                // ------------------------------

                subscriptionChatsUsed:
                  0,

                // ------------------------------
                // DAILY USAGE
                // ------------------------------

                dailyUsage: {
                  date:
                    indiaDate,

                  foodScans:
                    0,

                  bodyScans:
                    0,

                  aiChats:
                    0,
                },

                // ------------------------------
                // DODO DETAILS
                // ------------------------------

                dodoSubscriptionId:
                  data.subscription_id ||
                  data.id ||
                  null,

                dodoProductId:
                  productId,

                // ------------------------------
                // UPDATED
                // ------------------------------

                updatedAt:
                  now,
              },
            },

            {
              upsert: true,
            }
          );

      console.log(
        "=========================================="
      );

      console.log(
        "🎉 SUBSCRIPTION ACTIVATED"
      );

      console.log(
        "👤 Email:",
        email
      );

      console.log(
        "💎 Plan:",
        planConfig.plan
      );

      console.log(
        "🤖 AI Chats/Day:",
        planConfig.aiChatsPerDay
      );

      console.log(
        "📅 Expiry:",
        expiry
      );

      console.log(
        "💾 MongoDB:",
        result.acknowledged
          ? "UPDATED"
          : "FAILED"
      );

      console.log(
        "=========================================="
      );
    }

    // ==========================================
    // SUBSCRIPTION RENEWED
    // ==========================================

    if (
      event.type ===
      "subscription.renewed"
    ) {
      const data =
        event.data || {};

      const metadata =
        data.metadata || {};

      const email =
        metadata.user_email ||
        data.customer?.email ||
        data.customer_email;

      const productId =
        data.product_id ||
        data.product?.id;

      const planConfig =
        PRODUCT_PLANS[productId];

      if (
        email &&
        planConfig
      ) {
        const client =
          await clientPromise;

        const db =
          client.db("aurafit");

        const now =
          new Date();

        const expiry =
          new Date(now);

        expiry.setDate(
          expiry.getDate() +
            planConfig.durationDays
        );

        const indiaDate =
          new Intl.DateTimeFormat(
            "en-CA",
            {
              timeZone:
                "Asia/Kolkata",

              year: "numeric",

              month: "2-digit",

              day: "2-digit",
            }
          ).format(now);

        await db
          .collection("users")
          .updateOne(
            {
              email,
            },

            {
              $set: {
                plan:
                  planConfig.plan,

                membership:
                  `${planConfig.plan
                    .charAt(0)
                    .toUpperCase()}${planConfig.plan.slice(
                    1
                  )} Plan`,

                isPro: true,

                subscriptionStatus:
                  "active",

                subscriptionStartDate:
                  now,

                subscriptionExpiryDate:
                  expiry,

                subscriptionChatsUsed:
                  0,

                dailyUsage: {
                  date:
                    indiaDate,

                  foodScans:
                    0,

                  bodyScans:
                    0,

                  aiChats:
                    0,
                },

                dodoSubscriptionId:
                  data.subscription_id ||
                  data.id ||
                  null,

                dodoProductId:
                  productId,

                updatedAt:
                  now,
              },
            }
          );

        console.log(
          `🔄 ${planConfig.plan} renewed for ${email}`
        );
      }
    }

    // ==========================================
    // SUBSCRIPTION CANCELLED / EXPIRED
    // ==========================================

    if (
      event.type ===
        "subscription.cancelled" ||
      event.type ===
        "subscription.expired"
    ) {
      const data =
        event.data || {};

      const metadata =
        data.metadata || {};

      const email =
        metadata.user_email ||
        data.customer?.email ||
        data.customer_email;

      if (email) {
        const client =
          await clientPromise;

        const db =
          client.db("aurafit");

        await db
          .collection("users")
          .updateOne(
            {
              email,
            },

            {
              $set: {
                isPro: false,

                subscriptionStatus:
                  event.type ===
                  "subscription.cancelled"
                    ? "cancelled"
                    : "expired",

                updatedAt:
                  new Date(),
              },
            }
          );

        console.log(
          `🔒 Subscription ended for ${email}`
        );
      }
    }

    // ==========================================
    // FAILED / ON HOLD / PAST DUE
    // ==========================================

    if (
      event.type ===
        "subscription.failed" ||
      event.type ===
        "subscription.on_hold" ||
      event.type ===
        "subscription.past_due"
    ) {
      console.log(
        "⚠️ Subscription status:",
        event.type
      );
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        received: true,
        event: event.type,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "=========================================="
    );

    console.error(
      "❌ DODO TEST WEBHOOK ERROR:"
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Webhook verification failed",
      },
      {
        status: 401,
      }
    );
  }
}