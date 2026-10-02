"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Public routes jahan login ki zaroorat nahi hai
    const publicRoutes = ["/login", "/signup", "/", "/pricing", "/contact", "/author"];

    // Agar session load ho raha hai, toh wait karo
    if (status === "loading") return;

    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/workout/");

    // Agar user logged in nahi hai aur public route par bhi nahi hai, toh login par bhej do
    if (!session && !isPublicRoute) {
      router.push("/login");
    }
  }, [session, status, pathname, router]);

  // Jab tak session check ho raha hai, tab tak secure loader dikhao
  if (status === "loading" && !["/login", "/signup", "/"].includes(pathname)) {
    return (
      <div style={{ background: "#020617", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#38bdf8", fontFamily: "sans-serif" }}>
        <h2>Checking Security & Session... 🔒</h2>
      </div>
    );
  }

  return children;
}