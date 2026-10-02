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

    if (!email || !plan) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and plan are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const now = new Date();

    let normalizedPlan = String(plan).toLowerCase();

    // -----------------------------------
    // FREE
    // -----------------------------------

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
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        plan: "free",
        remainingChats: 1,
      });
    }

    // -----------------------------------
    // PLAN DURATION
    // -----------------------------------

    let durationDays = 0;
    let chatLimit = 0;

    if (normalizedPlan === "weekly") {
      durationDays = 7;
      chatLimit = 2;
    }

    if (normalizedPlan === "monthly") {
      durationDays = 30;
      chatLimit = 3;
    }

    if (normalizedPlan === "yearly") {
      durationDays = 365;
      chatLimit = null; // unlimited
    }

    if (!durationDays) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid subscription plan",
        },
        { status: 400 }
      );
    }

    // -----------------------------------
    // EXPIRY DATE
    // -----------------------------------

    const expiry = new Date(now);

    expiry.setDate(expiry.getDate() + durationDays);

    // -----------------------------------
    // SAVE REAL ENTITLEMENT
    // -----------------------------------

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          plan: normalizedPlan,
          membership: membership || `${normalizedPlan} Plan`,

          subscriptionStatus: "active",

          subscriptionStartDate: now,
          subscriptionExpiryDate: expiry,

          subscriptionChatsUsed: 0,

          razorpayPaymentId: paymentId || null,

          updatedAt: now,
        },
      },
      {
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      plan: normalizedPlan,
      membership: membership || `${normalizedPlan} Plan`,
      chatLimit,
      remainingChats:
        normalizedPlan === "yearly" ? "Unlimited" : chatLimit,
      subscriptionStartDate: now,
      subscriptionExpiryDate: expiry,
    });
  } catch (error) {
    console.error("Upgrade API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to activate subscription",
      },
      { status: 500 }
    );
  }
}