import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({
        success: true,
        plan: "free",
        membership: "Free Plan",
        remainingChats: 1,
        unlimited: false,
      });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: true,
        plan: "free",
        membership: "Free Plan",
        remainingChats: 1,
        unlimited: false,
      });
    }

    let plan = String(user.plan || "free").toLowerCase();

    // -----------------------------------
    // CHECK PAID PLAN EXPIRY
    // -----------------------------------

    if (
      plan !== "free" &&
      user.subscriptionExpiryDate &&
      new Date() >= new Date(user.subscriptionExpiryDate)
    ) {
      plan = "free";

      await db.collection("users").updateOne(
        { email },
        {
          $set: {
            plan: "free",
            membership: "Free Plan",
            subscriptionStatus: "expired",
            subscriptionChatsUsed: 0,
            subscriptionStartDate: null,
            subscriptionExpiryDate: null,
          },
        }
      );
    }

    // -----------------------------------
    // FREE
    // -----------------------------------

    if (plan === "free") {
      const used = user.freeChatUsed || 0;

      return NextResponse.json({
        success: true,
        plan: "free",
        membership: "Free Plan",
        chatLimit: 1,
        chatsUsed: used,
        remainingChats: Math.max(0, 1 - used),
        unlimited: false,
      });
    }

    // -----------------------------------
    // WEEKLY
    // -----------------------------------

    if (plan === "weekly") {
      const used = user.subscriptionChatsUsed || 0;

      return NextResponse.json({
        success: true,
        plan: "weekly",
        membership: "Weekly Plan",
        chatLimit: 2,
        chatsUsed: used,
        remainingChats: Math.max(0, 2 - used),
        unlimited: false,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
      });
    }

    // -----------------------------------
    // MONTHLY
    // -----------------------------------

    if (plan === "monthly") {
      const used = user.subscriptionChatsUsed || 0;

      return NextResponse.json({
        success: true,
        plan: "monthly",
        membership: "Monthly Plan",
        chatLimit: 3,
        chatsUsed: used,
        remainingChats: Math.max(0, 3 - used),
        unlimited: false,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
      });
    }

    // -----------------------------------
    // YEARLY
    // -----------------------------------

    if (plan === "yearly") {
      return NextResponse.json({
        success: true,
        plan: "yearly",
        membership: "Yearly Plan",
        chatLimit: null,
        chatsUsed: user.subscriptionChatsUsed || 0,
        remainingChats: "Unlimited",
        unlimited: true,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
      });
    }

    // fallback
    return NextResponse.json({
      success: true,
      plan: "free",
      membership: "Free Plan",
      remainingChats: 1,
      unlimited: false,
    });
  } catch (error) {
    console.error("User API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch user plan",
      },
      { status: 500 }
    );
  }
}