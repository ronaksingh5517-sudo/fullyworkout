"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingType, setLoadingType] = useState(null);

  const isDashboard = pathname?.includes("/dashboard");

  const handleNavigation = (path, type) => {
    if (pathname === path) return;
    setLoadingType(type);
    router.push(path);
  };

 const handleLogout = () => {
    setLoadingType("logout");
    // Logout ke baad seedha main homepage (/) par redirect karega
    signOut({ callbackUrl: "/" });
  };
  const handleAnchorClick = (e, targetId) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx>{`
        .custom-navbar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          background: transparent;
          padding: 16px 0;
         
        }
        .custom-nav-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-logo-wrap {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo-box {
          position: relative;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .logo-box img {
          border-radius: 40px;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
          transition: transform 0.3s ease;
        }
        .logo-box:hover img {
          transform: scale(1.05);
        }

        .custom-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          color: #f1f5f9;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: color 0.2s ease, opacity 0.2s ease;
          opacity: 0.9;
          cursor: pointer;
        }
        .nav-item:hover {
          color: #ff4b2b;
          opacity: 1;
        }

        .custom-nav-auth {
          display: flex;
          align-items: center;
        }

        /* 🌟 EXACT USER FLIP-SWITCH STYLING */
        .flip-switch-container {
          --card-width: 110px;
          --card-height: 80px;
          --switch-bg: rgba(255, 255, 255, 0.1);
          --switch-border-color: rgba(255, 255, 255, 0.2);
          --text-color: #ffffff;
          --inactive-text-color: rgba(255, 255, 255, 0.6);
          --icon-shadow-color: rgba(0, 0, 0, 0.3);
          --card-bg: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1)
          );
          --highlight-color: #64ffda;

          display: grid;
          place-content: center;
          font-family: "Poppins", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .flip-switch {
          display: flex;
          position: relative;
          width: ${session ? "calc(var(--card-width) * 2)" : "var(--card-width)"};
          height: var(--card-height);
          background: var(--switch-bg);
          border-radius: 20px;
          border: 1px solid var(--switch-border-color);
          box-shadow:
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 4px 8px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          perspective: 1000px;
        }

        .flip-switch input[type="radio"] {
          display: none;
        }

        .flip-switch .switch-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          z-index: 2;
          color: var(--inactive-text-color);
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }

        .flip-switch .switch-button:hover {
          color: var(--text-color);
        }

        .flip-switch .switch-button:hover svg {
          transform: translateY(-3px);
          filter: drop-shadow(0 4px 6px var(--icon-shadow-color)) brightness(1.2);
        }

        .flip-switch .switch-button svg {
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          filter: drop-shadow(0 2px 3px var(--icon-shadow-color));
          width: 24px;
          height: 24px;
        }

        .flip-switch .switch-button span {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .flip-switch #switch-opt-1:checked ~ [for="switch-opt-1"],
        .flip-switch #switch-opt-2:checked ~ [for="switch-opt-2"] {
          color: var(--text-color);
          text-shadow: 0 0 8px rgba(100, 255, 218, 0.5);
        }

        .flip-switch #switch-opt-1:checked ~ [for="switch-opt-2"],
        .flip-switch #switch-opt-2:checked ~ [for="switch-opt-1"] {
          color: var(--inactive-text-color);
        }

        .flip-switch .switch-card {
          position: absolute;
          top: 0;
          left: 0;
          width: var(--card-width);
          height: var(--card-height);
          z-index: 1;
          transform-style: preserve-3d;
        }

        .flip-switch .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          background: var(--card-bg);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.1);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .flip-switch .card-back {
          transform: rotateY(180deg);
        }

        .flip-switch #switch-opt-2:checked ~ .switch-card {
          animation: flipRight 0.6s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        .flip-switch #switch-opt-1:checked ~ .switch-card {
          animation: flipLeft 0.6s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }

        @keyframes flipRight {
          0% { transform: translateX(0%) rotateY(0deg); }
          50% { transform: translateX(50%) rotateY(90deg) scale(1.05); }
          100% { transform: translateX(100%) rotateY(180deg) scale(1); }
        }

        @keyframes flipLeft {
          0% { transform: translateX(100%) rotateY(180deg); }
          50% { transform: translateX(50%) rotateY(90deg) scale(1.05); }
          100% { transform: translateX(0%) rotateY(0deg) scale(1); }
        }

        .flip-switch #switch-opt-1:checked ~ [for="switch-opt-1"]::after,
        .flip-switch #switch-opt-2:checked ~ [for="switch-opt-2"]::after {
          content: "";
          position: absolute;
          bottom: -5px;
          width: 30px;
          height: 3px;
          background: var(--highlight-color);
          border-radius: 2px;
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 5px var(--highlight-color); }
          to {
            box-shadow:
              0 0 15px var(--highlight-color),
              0 0 25px var(--highlight-color);
          }
        }

        /* 🌟 FULLSCREEN TECH LOADER OVERLAY */
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(8, 10, 14, 0.95);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .main-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          max-width: 600px;
          padding: 20px;
        }

        .loader {
          width: 100%;
        }

        .trace-bg {
          stroke: #333;
          stroke-width: 1.8;
          fill: none;
        }

        .trace-flow {
          stroke-width: 1.8;
          fill: none;
          stroke-dasharray: 40 400;
          stroke-dashoffset: 438;
          filter: drop-shadow(0 0 6px currentColor);
          animation: flow 3s cubic-bezier(0.5, 0, 0.9, 1) infinite;
        }

        .yellow { stroke: #ffea00; color: #ffea00; }
        .blue { stroke: #00ccff; color: #00ccff; }
        .green { stroke: #00ff15; color: #00ff15; }
        .purple { stroke: #9900ff; color: #9900ff; }
        .red { stroke: #ff3300; color: #ff3300; }

        @keyframes flow {
          to { stroke-dashoffset: 0; }
        }

        @media (max-width: 900px) {
          .custom-nav-links { display: none; }
        }
        @media (max-width: 600px) {
          .custom-nav-container { padding: 0 14px; }
          .logo-box { width: 70px; height: 70px; }
          .flip-switch-container {
            transform: scale(0.75);
            transform-origin: right center;
          }
        }
      `}</style>

      {/* 🌟 LOADER OVERLAY */}
      {loadingType && (
        <div className="loader-overlay">
          <div className="main-container">
            <div className="loader">
              <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2d2d2d"></stop>
                    <stop offset="100%" stopColor="#0f0f0f"></stop>
                  </linearGradient>

                  <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eeeeee"></stop>
                    <stop offset="100%" stopColor="#888888"></stop>
                  </linearGradient>

                  <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#bbbbbb"></stop>
                    <stop offset="50%" stopColor="#888888"></stop>
                    <stop offset="100%" stopColor="#555555"></stop>
                  </linearGradient>
                </defs>

                <g id="traces">
                  <path d="M100 100 H200 V210 H326" className="trace-bg"></path>
                  <path d="M100 100 H200 V210 H326" className="trace-flow purple"></path>

                  <path d="M80 180 H180 V230 H326" className="trace-bg"></path>
                  <path d="M80 180 H180 V230 H326" className="trace-flow blue"></path>

                  <path d="M60 260 H150 V250 H326" className="trace-bg"></path>
                  <path d="M60 260 H150 V250 H326" className="trace-flow yellow"></path>

                  <path d="M100 350 H200 V270 H326" className="trace-bg"></path>
                  <path d="M100 350 H200 V270 H326" className="trace-flow green"></path>

                  <path d="M700 90 H560 V210 H474" className="trace-bg"></path>
                  <path d="M700 90 H560 V210 H474" className="trace-flow blue"></path>

                  <path d="M740 160 H580 V230 H474" className="trace-bg"></path>
                  <path d="M740 160 H580 V230 H474" className="trace-flow green"></path>

                  <path d="M720 250 H590 V250 H474" className="trace-bg"></path>
                  <path d="M720 250 H590 V250 H474" className="trace-flow red"></path>

                  <path d="M680 340 H570 V270 H474" className="trace-bg"></path>
                  <path d="M680 340 H570 V270 H474" className="trace-flow yellow"></path>
                </g>

                <rect
                  x="330"
                  y="190"
                  width="140"
                  height="100"
                  rx="20"
                  ry="20"
                  fill="url(#chipGradient)"
                  stroke="#222"
                  strokeWidth="3"
                  filter="drop-shadow(0 0 6px rgba(0,0,0,0.8))"
                ></rect>

                <g>
                  <rect x="322" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                  <rect x="322" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                  <rect x="322" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                  <rect x="322" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                </g>

                <g>
                  <rect x="470" y="205" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                  <rect x="470" y="225" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                  <rect x="470" y="245" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                  <rect x="470" y="265" width="8" height="10" fill="url(#pinGradient)" rx="2"></rect>
                </g>

                <text
                  x="400"
                  y="240"
                  fontFamily="Arial, sans-serif"
                  fontSize="20"
                  fill="url(#textGradient)"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {loadingType === "login" ? "Logging In..." : loadingType === "logout" ? "Logging Out..." : "Loading..."}
                </text>

                <circle cx="100" cy="100" r="5" fill="black"></circle>
                <circle cx="80" cy="180" r="5" fill="black"></circle>
                <circle cx="60" cy="260" r="5" fill="black"></circle>
                <circle cx="100" cy="350" r="5" fill="black"></circle>

                <circle cx="700" cy="90" r="5" fill="black"></circle>
                <circle cx="740" cy="160" r="5" fill="black"></circle>
                <circle cx="720" cy="250" r="5" fill="black"></circle>
                <circle cx="680" cy="340" r="5" fill="black"></circle>
              </svg>
            </div>
          </div>
        </div>
      )}

      <nav className="custom-navbar" aria-label="Main Navigation Bar">
        <div className="custom-nav-container">
          <Link href="/" className="brand-logo-wrap" aria-label="AuraFit Homepage">
            <div className="logo-box">
              <img src="/favicon.png" alt="Fully Workout Logo" />
            </div>
          </Link>

          <ul className="custom-nav-links">
            <li><Link href="/" className="nav-item">Home</Link></li>
            <li>
              <Link href="/onboarding" className="nav-item" onClick={(e) => handleAnchorClick(e, "#onboarding")}>
                Features
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="nav-item" onClick={(e) => handleAnchorClick(e, "#pricing")}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/onboarding" className="nav-item" style={{ color: "#ff6b4a" }}>
                Start for Free
              </Link>
            </li>
          </ul>

          <div className="custom-nav-auth">
            <div className="flip-switch-container">
              <div className="flip-switch">
                <input 
                  type="radio" 
                  id="switch-opt-1" 
                  name="flip-switch" 
                  checked={!isDashboard} 
                  readOnly 
                />
                {session && (
                  <input 
                    type="radio" 
                    id="switch-opt-2" 
                    name="flip-switch" 
                    checked={isDashboard} 
                    readOnly 
                  />
                )}

                {/* Left Switch: Agar logged in hai toh Logout, warna Login */}
                {session ? (
                  <label 
                    htmlFor="switch-opt-1" 
                    className="switch-button"
                    onClick={handleLogout}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-9c-1.1 0-2 .9-2 2v4h2V5h9v14h-9v-4H9v4c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                    </svg>
                    <span>Logout</span>
                  </label>
                ) : (
                  <label 
                    htmlFor="switch-opt-1" 
                    className="switch-button"
                    onClick={() => handleNavigation("/login", "login")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"></path>
                    </svg>
                    <span>Login</span>
                  </label>
                )}

                {/* Right Switch: Sirf tab dikhega jab user login ho */}
                {session && (
                  <label 
                    htmlFor="switch-opt-2" 
                    className="switch-button"
                    onClick={() => handleNavigation("/dashboard", "profile")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                    <span>Dashboard</span>
                  </label>
                )}

                {session && (
                  <div className="switch-card">
                    <div className="card-face card-front"></div>
                    <div className="card-face card-back"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}