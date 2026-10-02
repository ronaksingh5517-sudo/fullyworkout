"use client";

import Link from "next/link";

export default function AuthorPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#f8fafc", padding: "40px 20px 100px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <Link href="/" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "13px", fontWeight: 700, display: "inline-block", marginBottom: "24px" }}>
          ← Back to Home
        </Link>

        <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "24px", padding: "32px", boxShadow: "0 12px 40px rgba(0,0,0,0.7)" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "900", color: "#fff" }}>
              RS
            </div>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#fff", margin: "0 0 4px 0" }}>Ronak Singh</h1>
              <p style={{ fontSize: "14px", color: "#38bdf8", fontWeight: 700, margin: 0 }}>Founder & CEO, FullyWorkout AI</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "15px", lineHeight: "1.7", color: "#cbd5e1" }}>
            <p>
              Welcome! I am <strong>Ronak Singh</strong>, the Founder and CEO of FullyWorkout AI. I established this platform on <strong>January 10, 2026</strong>, at the age of 18, with a clear vision: to revolutionize health, fitness, and nutritional tracking by making advanced AI technology accessible, intuitive, and effective for everyone.
            </p>
            <p>
              At FullyWorkout, we engineer next-generation tools including Vision AI-powered food scanners, precision body posture diagnostics, and dynamic 30-day interactive workout roadmaps. Our mission is to empower individuals globally to achieve their peak physical transformation without complexity or guesswork.
            </p>

            <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", padding: "16px", borderRadius: "14px", marginTop: "10px" }}>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#4ade80", textTransform: "uppercase", marginBottom: "6px" }}>🚀 Quick Profile Facts</div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px", color: "#cbd5e1", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>Company:</strong> FullyWorkout AI</li>
                <li><strong>Established Date:</strong> January 10, 2026</li>
                <li><strong>Founder & CEO:</strong> Ronak Singh</li>
                <li><strong>Direct Email:</strong> <a href="mailto:ronaksingh5517@gmail.com" style={{ color: "#38bdf8", textDecoration: "none" }}>ronaksingh5517@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: "30px", display: "flex", gap: "12px" }}>
            <Link href="/contact" style={{ background: "linear-gradient(135deg, #38bdf8, #0284c7)", color: "#030712", padding: "12px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: 800, fontSize: "14px" }}>
              Contact Me ✉️
            </Link>
            <Link href="/dashboard" style={{ background: "rgba(255,255,255,0.06)", color: "#fff", padding: "12px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: 800, fontSize: "14px", border: "1px solid rgba(255,255,255,0.1)" }}>
              Explore App 🚀
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}