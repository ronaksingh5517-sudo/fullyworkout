"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Aura User");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Manual Drag / Swipe State for 3D Carousel
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    const savedName = localStorage.getItem("aurafit_user_name") || "Bro";
    const proStatus = localStorage.getItem("aurafit_is_pro") === "true";
    setUserName(savedName);
    setIsPro(proStatus);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const diff = currentX - startX;
    setRotY((prev) => prev + diff * 0.5);
    setStartX(currentX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <main style={{ 
      minHeight: "100vh", 
      background: "#080a0e", 
      color: "#ffffff", 
      padding: "24px 16px 110px 16px", 
      fontFamily: "system-ui, sans-serif", 
      boxSizing: "border-box",
      opacity: isLoaded ? 1 : 0, 
      transition: "opacity 0.3s ease-in-out" 
    }}>
      <div style={{ maxWidth: "580px", margin: "0 auto" }}>
        
        {/* TOP GREETING & STREAK HEADER WITH HAMBURGER MENU */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            style={{ 
              background: "rgba(255, 255, 255, 0.06)", 
              border: "1px solid rgba(255, 255, 255, 0.12)", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              width: "40px", 
              height: "40px", 
              borderRadius: "12px", 
              color: "#ffffff",
              flexShrink: 0
            }}
            aria-label="Open Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
            </svg>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #3700ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900, color: "#fff", boxShadow: "0 4px 14px rgba(56,189,248,0.3)" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Welcome</span>
                {isPro && <span style={{ fontSize: "9px", background: "#ddff00", color: "#000", fontWeight: 900, padding: "2px 6px", borderRadius: "6px" }}>PRO</span>}
              </div>
              <h1 style={{ fontSize: "16px", fontWeight: 900, margin: "0", color: "#fff" }}>{userName} 👋</h1>
            </div>
          </div>

          <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", padding: "8px 12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(8px)" }}>
            <span style={{ fontSize: "13px" }}>🔥</span>
            <span style={{ fontSize: "12px", fontWeight: 900, color: "#f59e0b" }}>0 Days</span>
          </div>
        </div>

        {/* SECTION HEADER (Moved Up) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, margin: 0, color: "#f1f5f9", letterSpacing: "0.3px" }}>AI Interactive Hub</h3>
          <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700 }}>Swipe / Drag to Spin ↔</span>
        </div>

        {/* 3D ROTATING CAROUSEL MIDDLE SECTION (Manual Drag & Auto-run, Clickable Links) */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{ width: "100%", height: "450px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginBottom: "20px", background: "#10141d", borderRadius: "22px", border: "1px solid rgba(255,255,255,0.08)", boxSizing: "border-box", position: "relative", cursor: "grab" }}
        >
          <div ref={carouselRef} className="card-3d" style={{ transform: `perspective(1000px) rotateY(${rotY}deg)` }}>
            <Link href="/food-scanner" className="card-item" style={{ backgroundImage: "url(/food-scan.png)", backgroundSize: "cover", backgroundPosition: "center", display: "block" }} title="Food Scanner"></Link>
            <Link href="/body-scan" className="card-item" style={{ backgroundImage: "url(/body-scan.png)", backgroundSize: "cover", backgroundPosition: "center", display: "block" }} title="Posture Scan"></Link>
            <Link href="/ai-coach" className="card-item" style={{ backgroundImage: "url(/coach1.png)", backgroundSize: "cover", backgroundPosition: "center", display: "block" }} title="AI Coach"></Link>
            <Link href="/workout" className="card-item" style={{ backgroundImage: "url(/body1.png)", backgroundSize: "cover", backgroundPosition: "center", display: "block" }} title="Workout Split"></Link>
            <Link href="/analytics" className="card-item" style={{ backgroundImage: "url(/gym-transformation.png)", backgroundSize: "cover", backgroundPosition: "center", display: "block" }} title="Analytics"></Link>
          </div>
        </div>

        {/* QUICK NAVIGATION BUTTONS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "26px" }}>
          <Link href="/food-scanner" style={{ textDecoration: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "14px", textAlign: "center", color: "#fff", fontWeight: 800, fontSize: "13.5px" }}>
            📸 Food Scanner
          </Link>
          <Link href="/body-scan" style={{ textDecoration: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "14px", textAlign: "center", color: "#fff", fontWeight: 800, fontSize: "13.5px" }}>
            🧍 Posture Scan
          </Link>
          <Link href="/ai-coach" style={{ textDecoration: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "14px", textAlign: "center", color: "#fff", fontWeight: 800, fontSize: "13.5px" }}>
            🤖 AI Coach
          </Link>
          <Link href="/workout" style={{ textDecoration: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px", borderRadius: "14px", textAlign: "center", color: "#fff", fontWeight: 800, fontSize: "13.5px" }}>
            💪 Workout Split
          </Link>
        </div>

        {/* HERO CARD - VISION FOOD SCANNER (Moved Down) */}
        <div className="hero-glow-card" style={{ width: "100%", marginBottom: "26px", borderRadius: "24px", padding: "1px", background: "linear-gradient(163deg, #00ff75 0%, #3700ff 50%, #38bdf8 100%)" }}>
          <div style={{ background: "#10141d", borderRadius: "23px", padding: "24px", position: "relative", overflow: "hidden" }}>
            
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "rgba(0,255,117,0.08)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }}></div>

            <div style={{ display: "inline-block", background: "rgba(0, 255, 117, 0.12)", color: "#00ff75", padding: "4px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px", marginBottom: "10px" }}>
              ✨ AI VISION ENGINE ACTIVE
            </div>
            
            <h2 style={{ fontSize: "21px", fontWeight: 900, margin: "0 0 8px 0", color: "#fff", letterSpacing: "-0.3px" }}>Snap Your Meal & Track Macros</h2>
            <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: "0 0 18px 0", lineHeight: "1.5" }}>
              Instant AI food breakdown, accurate calorie count, and heart-health insights straight from your camera.
            </p>

            <Link href="/food-scanner" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #00ff75, #0284c7)", color: "#030712", padding: "14px 20px", borderRadius: "16px", fontWeight: 900, fontSize: "14px", boxShadow: "0 6px 20px rgba(0,255,117,0.25)", transition: "transform 0.2s ease" }}>
              <span>Launch Food Scanner 📸</span>
            </Link>
          </div>
        </div>

      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <BottomNav />

      {/* SLIDING SIDEBAR COMPONENT */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <style jsx global>{`
        .hero-glow-card:hover {
          box-shadow: 0px 0px 35px rgba(0, 255, 117, 0.25);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        @keyframes autoRun3d {
          from {
            transform: perspective(1000px) rotateY(0deg);
          }
          to {
            transform: perspective(1000px) rotateY(-360deg);
          }
        }

        .card-3d {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: autoRun3d 40s linear infinite;
          will-change: transform;
        }

        .card-item {
          position: absolute;
          width: 300px;
          height:350px;
          background-color: rgba(5, 6, 15, 0.95);
          border: solid 2px rgb(0, 0, 0);
          border-radius: 0.75rem;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.65);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .card-item:hover {
          border-color: #38bdf8;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
        }

        /* 🌟 Exactly 5 Cards with Equal 72-degree Spacing */
        .card-3d .card-item:nth-child(1) {
          transform: translate(-50%, -50%) rotateY(0deg) translateZ(190px);
        }
        .card-3d .card-item:nth-child(2) {
          transform: translate(-50%, -50%) rotateY(72deg) translateZ(190px);
        }
        .card-3d .card-item:nth-child(3) {
          transform: translate(-50%, -50%) rotateY(144deg) translateZ(190px);
        }
        .card-3d .card-item:nth-child(4) {
          transform: translate(-50%, -50%) rotateY(216deg) translateZ(190px);
        }
        .card-3d .card-item:nth-child(5) {
          transform: translate(-50%, -50%) rotateY(288deg) translateZ(190px);
        }
      `}</style>
    </main>
  );
}