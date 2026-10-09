import { NextResponse } from "next/server";
import DodoPayments from "dodopayments";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  webhookKey: process.env.DODO_WEBHOOK_SECRET,
  environment: "live_mode",
});

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

export async function POST(req) {
  try {
    // IMPORTANT:
    // Webhook signature verification requires the RAW body.
    const rawBody = await req.text();

    const headers = {
      "webhook-id": req.headers.get("webhook-id"),
      "webhook-signature": req.headers.get("webhook-signature"),
      "webhook-timestamp": req.headers.get("webhook-timestamp"),
    };

    // Verify + decode Dodo webhook
    const event = dodo.webhooks.unwrap(rawBody, {
      headers,
    });

    console.log("✅ DODO WEBHOOK:", event.type);

    // ==========================================
    // SUBSCRIPTION ACTIVE
    // ==========================================

    if (event.type === "subscription.active") {
      const data = event.data || {};

      console.log(
        "📦 Subscription Active Data:",
        JSON.stringify(data, null, 2)
      );

      const metadata = data.metadata || {};

      const email =
        metadata.user_email ||
        data.customer?.email ||
        data.customer_email;

      const productId =
        data.product_id ||
        data.product?.id;

      if (!email) {
        console.error("❌ No customer email found in webhook");
        return NextResponse.json(
          {
            success: false,
            error: "Customer email missing",
          },
          { status: 400 }
        );
      }

      const planConfig = PRODUCT_PLANS[productId];

      if (!planConfig) {
        console.error(
          "❌ Unknown Dodo product:",
          productId
        );

        return NextResponse.json(
          {
            success: false,
            error: "Unknown product",
          },
          { status: 400 }
        );
      }

      const client = await clientPromise;
      const db = client.db("aurafit");

      const now = new Date();

      const expiry = new Date(now);

      expiry.setDate(
        expiry.getDate() +
          planConfig.durationDays
      );

      const indiaDate =
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now);

      await db.collection("users").updateOne(
        { email },

        {
          $set: {
            plan: planConfig.plan,

            membership:
              `${planConfig.plan
                .charAt(0)
                .toUpperCase()}${planConfig.plan.slice(1)} Plan`,

            isPro: true,

            subscriptionStatus: "active",

            subscriptionStartDate: now,

            subscriptionExpiryDate: expiry,

            subscriptionChatsUsed: 0,

            dailyUsage: {
              date: indiaDate,
              foodScans: 0,
              bodyScans: 0,
              aiChats: 0,
            },

            dodoSubscriptionId:
              data.subscription_id ||
              data.id ||
              null,

            dodoProductId: productId,

            updatedAt: now,
          },
        },

        {
          upsert: true,
        }
      );

      console.log(
        `🎉 ${planConfig.plan} activated for ${email}`
      );
    }

    // ==========================================
    // SUBSCRIPTION RENEWED
    // ==========================================

    if (event.type === "subscription.renewed") {
      const data = event.data || {};
      const metadata = data.metadata || {};

      const email =
        metadata.user_email ||
        data.customer?.email ||
        data.customer_email;

      const productId =
        data.product_id ||
        data.product?.id;

      const planConfig = PRODUCT_PLANS[productId];

      if (email && planConfig) {
        const client = await clientPromise;
        const db = client.db("aurafit");

        const now = new Date();

        const expiry = new Date(now);

        expiry.setDate(
          expiry.getDate() +
            planConfig.durationDays
        );

        await db.collection("users").updateOne(
          { email },

          {
            $set: {
              plan: planConfig.plan,

              membership:
                `${planConfig.plan
                  .charAt(0)
                  .toUpperCase()}${planConfig.plan.slice(1)} Plan`,

              isPro: true,

              subscriptionStatus: "active",

              subscriptionStartDate: now,

              subscriptionExpiryDate: expiry,

              subscriptionChatsUsed: 0,

              dodoSubscriptionId:
                data.subscription_id ||
                data.id ||
                null,

              dodoProductId: productId,

              updatedAt: now,
            },
          }
        );

        console.log(
          `🔄 ${planConfig.plan} renewed for ${email}`
        );
      }
    }

    // ==========================================
    // CANCELLED / EXPIRED
    // ==========================================

    if (
      event.type === "subscription.cancelled" ||
      event.type === "subscription.expired"
    ) {
      const data = event.data || {};
      const metadata = data.metadata || {};

      const email =
        metadata.user_email ||
        data.customer?.email ||
        data.customer_email;

      if (email) {
        const client = await clientPromise;
        const db = client.db("aurafit");

        await db.collection("users").updateOne(
          { email },

          {
            $set: {
              isPro: false,
              subscriptionStatus:
                event.type ===
                "subscription.cancelled"
                  ? "cancelled"
                  : "expired",

              updatedAt: new Date(),
            },
          }
        );

        console.log(
          `🔒 Subscription ended for ${email}`
        );
      }
    }

    // ==========================================
    // OTHER EVENTS
    // ==========================================

    if (
      event.type === "subscription.failed" ||
      event.type === "subscription.on_hold"
    ) {
      console.log(
        `⚠️ Subscription status: ${event.type}`
      );
    }

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error) {
    console.error(
      "❌ Dodo Webhook Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Webhook verification failed",
      },
      { status: 401 }
    );
  }
}
































// import { NextResponse } from "next/server";
// import DodoPayments from "dodopayments";
// import clientPromise from "@/lib/mongodb";

// export const runtime = "nodejs";

// const dodo = new DodoPayments({
//   bearerToken: process.env.DODO_API_KEY,
//   webhookKey: process.env.DODO_WEBHOOK_SECRET,
//  environment: "test_mode",
// });

// const PRODUCT_PLANS = {
//   [process.env.DODO_WEEKLY_PRODUCT_ID]: {
//     plan: "weekly",
//     durationDays: 7,
//     aiChatsPerDay: 20,
//   },

//   [process.env.DODO_MONTHLY_PRODUCT_ID]: {
//     plan: "monthly",
//     durationDays: 30,
//     aiChatsPerDay: 30,
//   },

//   [process.env.DODO_YEARLY_PRODUCT_ID]: {
//     plan: "yearly",
//     durationDays: 365,
//     aiChatsPerDay: 100,
//   },
// };

// export async function POST(req) {
//   try {
//     // IMPORTANT:
//     // Webhook signature verification requires the RAW body.
//     const rawBody = await req.text();

//     const headers = {
//       "webhook-id": req.headers.get("webhook-id"),
//       "webhook-signature": req.headers.get("webhook-signature"),
//       "webhook-timestamp": req.headers.get("webhook-timestamp"),
//     };

//     // Verify + decode Dodo webhook
//     const event = dodo.webhooks.unwrap(rawBody, {
//       headers,
//     });

//     console.log("✅ DODO WEBHOOK:", event.type);

//     // ==========================================
//     // SUBSCRIPTION ACTIVE
//     // ==========================================

//     if (event.type === "subscription.active") {
//       const data = event.data || {};

//       console.log(
//         "📦 Subscription Active Data:",
//         JSON.stringify(data, null, 2)
//       );

//       const metadata = data.metadata || {};

//       const email =
//         metadata.user_email ||
//         data.customer?.email ||
//         data.customer_email;

//       const productId =
//         data.product_id ||
//         data.product?.id;

//       if (!email) {
//         console.error("❌ No customer email found in webhook");
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Customer email missing",
//           },
//           { status: 400 }
//         );
//       }

//       const planConfig = PRODUCT_PLANS[productId];

//       if (!planConfig) {
//         console.error(
//           "❌ Unknown Dodo product:",
//           productId
//         );

//         return NextResponse.json(
//           {
//             success: false,
//             error: "Unknown product",
//           },
//           { status: 400 }
//         );
//       }

//       const client = await clientPromise;
//       const db = client.db("aurafit");

//       const now = new Date();

//       const expiry = new Date(now);

//       expiry.setDate(
//         expiry.getDate() +
//           planConfig.durationDays
//       );

//       const indiaDate =
//         new Intl.DateTimeFormat("en-CA", {
//           timeZone: "Asia/Kolkata",
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//         }).format(now);

//       await db.collection("users").updateOne(
//         { email },

//         {
//           $set: {
//             plan: planConfig.plan,

//             membership:
//               `${planConfig.plan
//                 .charAt(0)
//                 .toUpperCase()}${planConfig.plan.slice(1)} Plan`,

//             isPro: true,

//             subscriptionStatus: "active",

//             subscriptionStartDate: now,

//             subscriptionExpiryDate: expiry,

//             subscriptionChatsUsed: 0,

//             dailyUsage: {
//               date: indiaDate,
//               foodScans: 0,
//               bodyScans: 0,
//               aiChats: 0,
//             },

//             dodoSubscriptionId:
//               data.subscription_id ||
//               data.id ||
//               null,

//             dodoProductId: productId,

//             updatedAt: now,
//           },
//         },

//         {
//           upsert: true,
//         }
//       );

//       console.log(
//         `🎉 ${planConfig.plan} activated for ${email}`
//       );
//     }

//     // ==========================================
//     // SUBSCRIPTION RENEWED
//     // ==========================================

//     if (event.type === "subscription.renewed") {
//       const data = event.data || {};
//       const metadata = data.metadata || {};

//       const email =
//         metadata.user_email ||
//         data.customer?.email ||
//         data.customer_email;

//       const productId =
//         data.product_id ||
//         data.product?.id;

//       const planConfig = PRODUCT_PLANS[productId];

//       if (email && planConfig) {
//         const client = await clientPromise;
//         const db = client.db("aurafit");

//         const now = new Date();

//         const expiry = new Date(now);

//         expiry.setDate(
//           expiry.getDate() +
//             planConfig.durationDays
//         );

//         await db.collection("users").updateOne(
//           { email },

//           {
//             $set: {
//               plan: planConfig.plan,

//               membership:
//                 `${planConfig.plan
//                   .charAt(0)
//                   .toUpperCase()}${planConfig.plan.slice(1)} Plan`,

//               isPro: true,

//               subscriptionStatus: "active",

//               subscriptionStartDate: now,

//               subscriptionExpiryDate: expiry,

//               subscriptionChatsUsed: 0,

//               dodoSubscriptionId:
//                 data.subscription_id ||
//                 data.id ||
//                 null,

//               dodoProductId: productId,

//               updatedAt: now,
//             },
//           }
//         );

//         console.log(
//           `🔄 ${planConfig.plan} renewed for ${email}`
//         );
//       }
//     }

//     // ==========================================
//     // CANCELLED / EXPIRED
//     // ==========================================

//     if (
//       event.type === "subscription.cancelled" ||
//       event.type === "subscription.expired"
//     ) {
//       const data = event.data || {};
//       const metadata = data.metadata || {};

//       const email =
//         metadata.user_email ||
//         data.customer?.email ||
//         data.customer_email;

//       if (email) {
//         const client = await clientPromise;
//         const db = client.db("aurafit");

//         await db.collection("users").updateOne(
//           { email },

//           {
//             $set: {
//               isPro: false,
//               subscriptionStatus:
//                 event.type ===
//                 "subscription.cancelled"
//                   ? "cancelled"
//                   : "expired",

//               updatedAt: new Date(),
//             },
//           }
//         );

//         console.log(
//           `🔒 Subscription ended for ${email}`
//         );
//       }
//     }

//     // ==========================================
//     // OTHER EVENTS
//     // ==========================================

//     if (
//       event.type === "subscription.failed" ||
//       event.type === "subscription.on_hold"
//     ) {
//       console.log(
//         `⚠️ Subscription status: ${event.type}`
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       received: true,
//     });
//   } catch (error) {
//     console.error(
//       "❌ Dodo Webhook Error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error: "Webhook verification failed",
//       },
//       { status: 401 }
//     );
//   }
// }















