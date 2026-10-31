import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db("aurafit");

  const user = await db.collection("users").findOne({
    email: session.user.email.trim().toLowerCase(),
  });

  if (!user) {
    redirect("/");
  }

  const status = user.subscriptionStatus;
  const expiry = user.subscriptionExpiryDate
    ? new Date(user.subscriptionExpiryDate)
    : null;

  const isActive =
    user.isPro === true &&
    status === "active" &&
    expiry &&
    !Number.isNaN(expiry.getTime()) &&
    expiry.getTime() > Date.now();

  if (isActive) {
    redirect("/dashboard");
  }

  if (["failed", "expired", "cancelled", "on_hold"].includes(status)) {
    redirect("/");
  }

  redirect("/paywall/step-1");
}