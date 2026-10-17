"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AffiliateLeadTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email && typeof window !== "undefined" && window.fpr) {
      window.fpr("referral", { email: session.user.email });
    }
  }, [session]);

  return null;
}