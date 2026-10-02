"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to send message. Try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please email directly at ronaksingh5517@gmail.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#f8fafc", padding: "40px 20px 100px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        <Link href="/" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "13px", fontWeight: 700, display: "inline-block", marginBottom: "24px" }}>
          ← Back to Home
        </Link>

        <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "24px", padding: "32px", boxShadow: "0 12px 40px rgba(0,0,0,0.7)" }}>
          
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", margin: "0 0 8px 0" }}>Contact FullyWorkout</h1>
          <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6", margin: "0 0 24px 0" }}>
            Have a question, feedback, or want to reach out directly to CEO Ronak Singh? Drop a message below or email us at <a href="mailto:ronaksingh5517@gmail.com" style={{ color: "#38bdf8", textDecoration: "none" }}>ronaksingh5517@gmail.com</a>.
          </p>

          {errorMsg && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "12px", borderRadius: "10px", color: "#ef4444", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          {submitted ? (
            <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "20px", borderRadius: "14px", textAlign: "center", color: "#4ade80", fontWeight: 700 }}>
              🎉 Thank you! Your message has been received by CEO Ronak Singh and saved securely. We will contact you at ronaksingh5517@gmail.com.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>Your Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#030712", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "14px", boxSizing: "border-box" }} 
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>Your Email</label>
                <input 
                  type="email" 
                  placeholder="yourname@gmail.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#030712", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "14px", boxSizing: "border-box" }} 
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>Message</label>
                <textarea 
                  rows={4} 
                  placeholder="How can we help you?" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#030712", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", outline: "none", fontSize: "14px", boxSizing: "border-box", resize: "vertical" }} 
                />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg, #38bdf8, #0284c7)", color: "#030712", padding: "14px", borderRadius: "12px", border: "none", fontWeight: 900, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "8px" }}>
                {loading ? "Sending..." : "Send Message 🚀"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}