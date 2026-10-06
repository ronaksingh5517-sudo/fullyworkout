import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DodoPayments from "dodopayments";

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: "live_mode",
});

const PRODUCT_IDS = {
  weekly: process.env.DODO_WEEKLY_PRODUCT_ID,
  monthly: process.env.DODO_MONTHLY_PRODUCT_ID,
  yearly: process.env.DODO_YEARLY_PRODUCT_ID,
};

export async function POST(req) {
  try {
    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Please login first.",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // REQUEST
    // ==========================================

    const body = await req.json();

    const plan = String(body?.plan || "")
      .trim()
      .toLowerCase();

    // ==========================================
    // PRODUCT ID FROM SERVER ONLY
    // ==========================================

    const productId = PRODUCT_IDS[plan];

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid subscription plan.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // CREATE DODO CHECKOUT SESSION
    // ==========================================

    const checkoutSession =
      await client.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],

        customer: {
          email: session.user.email,
          name:
            session.user.name ||
            "FullyWorkout User",
        },

        metadata: {
          user_email: session.user.email,
          plan: plan,
        },

        return_url:
          "https://fullyworkout.com/dashboard",
      });

    // ==========================================
    // CHECKOUT URL
    // ==========================================

    if (!checkoutSession?.checkout_url) {
      return NextResponse.json(
        {
          success: false,
          error: "Dodo checkout URL was not returned.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.checkout_url,
      sessionId: checkoutSession.session_id,
    });
  } catch (error) {
    console.error(
      "Dodo Checkout Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to create Dodo checkout.",
      },
      { status: 500 }
    );
  }
}