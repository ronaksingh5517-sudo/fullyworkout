"use client";

import { useState, useEffect } from "react";
import PricingSection from "@/components/PricingSection";


export default function PricingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <main style={{ minHeight: "100vh", background: "#080a0e" }}></main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#080a0e" }}>
      <PricingSection />
    </main>
  );
}