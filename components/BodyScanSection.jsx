"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BodyScanSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        .section-hero-2 {
          position: relative;
          background: #080a0e !important;
          min-height: 96vh;
          display: flex;
          align-items: center;
          padding: 70px 24px;
          overflow: hidden;
        }
        .section-hero-2-container {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-2-image-box {
          flex: 1.2 1 0%;
          width: 100%;
          height: 88vh;
          max-height: 820px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-80px) scale(0.95);
          transition: opacity 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-2-image-box.scrolled-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .hero-2-glow-bg {
          position: absolute;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 230, 0, 0.25) 0%, rgba(255, 75, 43, 0.12) 45%, rgba(8, 10, 14, 0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-2-scan-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-2-scan-img {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transform: scale(1.12); /* 🚀 Image ko aur bada aur prominent kar diya hai */
          filter: drop-shadow(0 30px 45px rgba(0, 0, 0, 0.9));
          animation: scanFloatFluid 5s ease-in-out infinite;
        }
        @keyframes scanFloatFluid {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1.12); }
          50% { transform: translateY(-14px) rotate(-1.2deg) scale(1.15); }
        }
        .scan-laser-beam {
          position: absolute;
          left: 5%;
          width: 90%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ffe600, #ff416c, #ffe600, transparent);
          box-shadow: 0 0 20px 5px rgba(255, 230, 0, 0.8);
          border-radius: 50%;
          z-index: 2;
          pointer-events: none;
          animation: scanLaser 3.5s ease-in-out infinite alternate;
        }
        @keyframes scanLaser {
          0% { top: 6%; opacity: 0.15; }
          15% { opacity: 0.95; }
          85% { opacity: 0.95; }
          100% { top: 94%; opacity: 0.15; }
        }
        .hero-2-text-wrap {
          flex: 1 1 0%;
          max-width: 540px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          z-index: 3;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .hero-badge .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff4b2b;
          box-shadow: 0 0 8px #ff4b2b;
        }
        .hero-2-text-wrap h2 {
          font-size: clamp(2.2rem, 4.5vw, 3.9rem);
          line-height: 1.15;
          margin: 0 0 18px 0;
          color: #ffffff;
          font-weight: 800;
        }
        .yellow-red-animated-text {
          background: linear-gradient(
            110deg,
            #ffe600 0%,
            #ffe600 35%,
            #fff066 50%,
            #ff3d3d 52%,
            #ffe600 54%,
            #ffe600 85%,
            #ffb703 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: yellowRedShine 3.6s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes yellowRedShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-underline-wrapper {
          position: relative;
          display: inline-block;
          padding-bottom: 6px;
        }
        .animated-underline-wrapper::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          border-radius: 4px;
          background: linear-gradient(90deg, #ffe600 0%, #ffe600 48%, #ff3d3d 50%, #ffe600 52%, #ffb703 100%);
          background-size: 250% 100%;
          animation: yellowRedShine 3.6s ease-in-out infinite;
          box-shadow: 0 2px 14px rgba(255, 230, 0, 0.6);
        }
        .hero-desc {
          max-width: 480px;
          margin: 0 0 30px 0;
          line-height: 1.7;
          color: #94a3b8;
          font-size: 16px;
        }
        .hero-2-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 968px) {
          .section-hero-2 {
            min-height: auto;
            padding: 40px 16px 60px;
          }
          .section-hero-2-container {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          .hero-2-image-box {
            order: 1;
            height: 60vh;
            min-height: 420px;
            max-height: 560px;
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            transform: translateX(0);
          }
          .hero-2-scan-img {
            transform: scale(1.05);
          }
          .hero-2-text-wrap {
            order: 2;
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          .hero-2-actions {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

      <section className="section-hero-2" id="page-2" ref={sectionRef} aria-label="AI Body Scan and Posture Analysis Engine">
        <div className="section-hero-2-container">
          
          <div className={`hero-2-image-box ${isVisible ? "scrolled-in" : ""}`}>
            <div className="hero-2-glow-bg"></div>
            <div className="hero-2-scan-wrapper">
              <div className="scan-laser-beam"></div>
              <img src="/scan.png" alt="AI Body Posture and Fat Loss Scan Engine" className="hero-2-scan-img" loading="lazy" />
            </div>
          </div>

          <div className="hero-2-text-wrap">
            <div className="hero-badge">
              <span className="dot"></span>
              Advanced AI Body Scanner & Posture Analysis
            </div>

            <h2>
              <span>Scan Body</span><br />
              <span className="yellow-red-animated-text">and Start a</span><br />
              <span className="yellow-red-animated-text animated-underline-wrapper">Transformation</span>
            </h2>

            <p className="hero-desc">
              Utilize next-gen computer vision and AI body mapping to analyze your posture, track fat loss metrics, and generate instant custom workout routines tailored for your body type.
            </p>

            <div className="hero-2-actions">
              <Link href="/body-scan" className="btn btn-primary btn-lg" style={{ width: "100%", textAlign: "center", justifyContent: "center" }}>
                Body Scan Now →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}