"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthView({ initialStep = "onboarding" }) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep); 
  const [formData, setFormData] = useState({ name: "", age: "", weight: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.weight) return;
    
    setLoading(true);
    try {
      // Backend par onboarding profile details save karne ke liye API call
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok || data.success) {
        // Data save hone ke baad login step par shift karo
        setStep("login");
      } else {
        alert(data.error || "Failed to save profile details.");
      }
    } catch (err) {
      console.error("Onboarding error:", err);
      // Fallback agar API route abhi set na ho
      setStep("login");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NextAuth credentials login ya custom API login
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        alert("Invalid email or password. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      
      {step === "onboarding" ? (
        /* 1. PEHLE SAWAAL (Name, Age, Weight) */
        <form onSubmit={handleOnboardingSubmit} style={{ background: "#0b0f17", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, textAlign: "center", margin: 0 }}>FullyWorkout AI Setup 🤖</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: 0 }}>Please enter your basic details.</p>
          
          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Name</label>
            <input type="text" required placeholder="Your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Age</label>
            <input type="number" required placeholder="e.g., 22" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Weight (in kg)</label>
            <input type="number" required placeholder="e.g., 70" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", marginTop: "10px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Submit Details & Go to Login →"}
          </button>
        </form>
      ) : (
        /* 2. USKE BAAD LOGIN PAGE */
        <form onSubmit={handleLoginSubmit} style={{ background: "#0b0f17", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, textAlign: "center", margin: 0 }}>Login to FullyWorkout 🔐</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: 0 }}>Sign in to your account.</p>
          
          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Email</label>
            <input type="email" required placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Password</label>
            <input type="password" required placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", marginTop: "10px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Authenticating..." : "Login & Open Dashboard →"}
          </button>
        </form>
      )}

    </div>
  );
}