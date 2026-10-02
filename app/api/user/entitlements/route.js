import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDailyUsage } from "@/lib/dailyUsage";

export async function GET() {
  try {
    // --------------------------------------------
    // AUTH CHECK
    // --------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // --------------------------------------------
    // GET CENTRAL DAILY USAGE
    // --------------------------------------------

    const usage = await getDailyUsage(email);

    // --------------------------------------------
    // COMMON RESPONSE
    // Food Scanner, Body Scanner aur AI Coach
    // isi response ko use karenge.
    // --------------------------------------------

    return NextResponse.json({
      success: true,

      date: usage.date,

      // ------------------------------------------
      // ONE CENTRAL PLAN
      // ------------------------------------------

      plan: usage.plan,

      // ------------------------------------------
      // PLAN INFORMATION
      // ------------------------------------------

      planDetails: {
        name: usage.features.name,

        ads: usage.features.ads,

        analytics: usage.features.analytics,

        personalCoach: usage.features.personalCoach,

        proAnalytics: usage.features.proAnalytics,

        vipAnalytics: usage.features.vipAnalytics,

        seasonalChallenges:
          usage.features.seasonalChallenges,

        earlyAiAccess:
          usage.features.earlyAiAccess,
      },

      // ------------------------------------------
      // DAILY USAGE
      // ------------------------------------------

      usage: {
        foodScans: usage.foodScans,

        bodyScans: usage.bodyScans,

        aiChats: usage.aiChats,
      },

      // ------------------------------------------
      // DAILY LIMITS
      // ------------------------------------------

      limits: {
        foodScans: usage.limits.foodScans,

        bodyScans: usage.limits.bodyScans,

        aiChats: usage.limits.aiChats,
      },

      // ------------------------------------------
      // REMAINING
      // ------------------------------------------

      remaining: {
        foodScans: usage.remaining.foodScans,

        bodyScans: usage.remaining.bodyScans,

        aiChats: usage.remaining.aiChats,
      },
    });
  } catch (error) {
    console.error(
      "Entitlements API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch user entitlements",
      },
      { status: 500 }
    );
  }
}