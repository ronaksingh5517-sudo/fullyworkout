import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db("aurafit");

  const user = await db.collection("users").findOne({
    email: session.user.email.toLowerCase(),
  });

  if (!user) redirect("/");

  const expiry = user.subscriptionExpiryDate
    ? new Date(user.subscriptionExpiryDate)
    : null;

  const isActive =
    user.isPro === true &&
    user.subscriptionStatus === "active" &&
    expiry &&
    expiry.getTime() > Date.now();

  if (!isActive) {
    if (
      ["failed", "expired", "cancelled"].includes(
        user.subscriptionStatus
      )
    ) {
      redirect("/");
    }

    redirect("/paywall/step-1");
  }

  return children;
}