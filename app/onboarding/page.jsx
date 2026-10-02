"use client";

import { useRouter } from "next/navigation";
import OnboardingWizard from "@/components/OnboardingWizard";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = (data) => {
    // User ki details browser mein save karke dashboard par bhej do
    localStorage.setItem("aurafit_user", JSON.stringify(data));
    router.push("/dashboard");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}