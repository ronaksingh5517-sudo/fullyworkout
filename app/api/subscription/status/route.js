import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { authenticated: false, isPro: false },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const user = await db.collection("users").findOne({
      email: session.user.email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({
        authenticated: true,
        isPro: false,
        status: "unpaid",
      });
    }

    const expiry = user.subscriptionExpiryDate
      ? new Date(user.subscriptionExpiryDate)
      : null;

    const isPro =
      user.isPro === true &&
      user.subscriptionStatus === "active" &&
      expiry &&
      expiry.getTime() > Date.now();

    return NextResponse.json({
      authenticated: true,
      isPro: Boolean(isPro),
      status: user.subscriptionStatus || "unpaid",
    });
  } catch (error) {
    console.error("Subscription status error:", error);

    return NextResponse.json(
      { error: "Unable to verify subscription" },
      { status: 500 }
    );
  }
}