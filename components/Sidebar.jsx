"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
export default function Sidebar({ isOpen, onClose }) {
  const [userName, setUserName] = useState("Ronak Singh");

  useEffect(() => {
    const storedName = localStorage.getItem("aurafit_user_name") || "Ronak Singh";
    setUserName(storedName);
  }, []);



// ... baaki ka code

  const handleLogout = async () => {
    localStorage.removeItem("aurafit_is_pro");
    localStorage.removeItem("daily_scans");
    localStorage.removeItem("aurafit_user_name");
    
    // NextAuth session khatam karo aur seedha home (/) par redirect karo
    await signOut({ callbackUrl: "/" });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "flex-start",
    }}>
      {/* Sidebar Box with Scroll Enabled */}
      <div style={{
        width: "310px",
        maxWidth: "88vw",
        height: "100%",
        background: "#000000",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "22px 18px",
        boxSizing: "border-box",
        overflowY: "auto", /* 🌟 Added smooth scroll */
        animation: "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}>
        
        {/* TOP SECTION */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/favicon.png" alt="Logo" style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "8px" }} />
              <span style={{ fontSize: "19px", fontWeight: 800, color: "#fff", letterSpacing: "-0.2px" }}>AuraFit AI</span>
            </div>
            
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94a3b8", width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px" }}>✕</button>
          </div>

          {/* New AI Scan Button */}
          <Link href="/food-scanner" onClick={onClose} style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 16px", borderRadius: "14px", color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "26px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>✨</span>
              <span>New AI Scan</span>
            </div>
            <span style={{ fontSize: "11.5px", color: "#64748b", background: "rgba(255,255,255,0.08)", padding: "2px 7px", borderRadius: "6px" }}>⌘K</span>
          </Link>

          {/* ALL FEATURES & QUICK TOOLS */}
          <div style={{ padding: "0 4px" }}>
            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.6px" }}>Quick Tools & Features</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/dashboard" onClick={onClose} className="tool-item">
                <span className="emoji-icon">🏠</span> Dashboard
              </Link>

              <Link href="/workout" onClick={onClose} className="tool-item">
                <span className="emoji-icon">💪</span> Workout Split
              </Link>

              <Link href="/body-scan" onClick={onClose} className="tool-item">
                <span className="emoji-icon">🧍</span> Body Posture Scan
              </Link>

              <Link href="/ai-coach" onClick={onClose} className="tool-item">
                <span className="emoji-icon">🤖</span> AI Fitness Coach
              </Link>

              <Link href="/food-scanner" onClick={onClose} className="tool-item">
                <span className="emoji-icon">📸</span> AI Food Scanner
              </Link>

              <Link href="/analytics" onClick={onClose} className="tool-item">
                <span className="emoji-icon">📈</span> Progress Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: User Profile & Logout */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          
          <Link href="/pricing" onClick={onClose} style={{ textDecoration: "none", width: "100%" }}>
            <button className="buttonupgrade" style={{ width: "100%", justifyContent: "center", padding: "12px 16px", boxSizing: "border-box" }}>
              <svg viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" style={{ width: "18px", fill: "#000" }}>
                <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z"></path>
              </svg>
              <span>Unlock Pro</span>
            </button>
          </Link>

          {/* Profile Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #3700ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "14px", color: "#fff" }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: "14.5px", fontWeight: 700, color: "#fff" }}>{userName}</div>
                <div style={{ fontSize: "11.5px", color: "#38bdf8" }}>Active Plan</div>
              </div>
            </div>

            <button onClick={handleLogout} title="Logout" style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "6px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
              </svg>
            </button>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .tool-item {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 17px;
          font-weight: 600;
          padding: 11px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.02);
          transition: background 0.2s, color 0.2s;
        }
        .tool-item:hover {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
        }
        .emoji-icon {
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
        }
        .buttonupgrade {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 0.6rem;
          font-weight: bold;
          font-size: 15px;
          border-radius: 22px;
          text-shadow: 2px 2px 3px rgba(221, 255, 0, 0.3);
          background: linear-gradient(
              15deg,
              #ddff00,
              #b8d100,
              #93a300,
              #6e7500,
              #ddff00,
              #b8d100,
              #93a300,
              #6e7500
            )
            no-repeat;
          background-size: 300%;
          color: #000;
          border: none;
          background-position: left center;
          box-shadow: 0 20px 10px -15px rgba(221, 255, 0, 0.2);
          transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
        }
        .buttonupgrade:hover {
          background-size: 320%;
          background-position: right center;
          transform: scale(1.02);
          color: #000;
        }
      `}</style>
    </div>
  );
}