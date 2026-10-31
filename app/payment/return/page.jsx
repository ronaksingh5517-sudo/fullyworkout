"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentReturnPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    let active = true;
    let attempts = 0;

    const verifyPayment = async () => {
      while (active && attempts < 20) {
        attempts++;

        try {
          const response = await fetch("/api/subscription/status", {
            cache: "no-store",
          });

          if (response.ok) {
            const data = await response.json();

            if (data.isPro === true) {
              setMessage("Payment verified! Redirecting...");
              router.replace("/dashboard");
              return;
            }

            if (
              ["failed", "expired", "cancelled"].includes(data.status)
            ) {
              router.replace("/");
              return;
            }
          } else if (response.status === 401) {
            router.replace("/login");
            return;
          }
        } catch (error) {
          console.error("Payment verification error:", error);
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (active) {
        setMessage("Payment is not verified yet. Please try again later.");
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#080a0e",
      color: "#fff",
      fontFamily: "system-ui",
      textAlign: "center",
      padding: "24px"
    }}>
      <div style={{ fontSize: "42px", marginBottom: "16px" }}>⌛</div>
      <h2>Payment Verification</h2>
      <p style={{ color: "#94a3b8" }}>{message}</p>
    </main>
  );
}