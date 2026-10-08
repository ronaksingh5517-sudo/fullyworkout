"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TransformationSection() {
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
        .section-hero-4 {
          position: relative;
          min-height: 96vh;
          display: flex;
          align-items: center;
          background: #080a0e !important;
          padding: 70px 24px;
          overflow: hidden;
        }
        .section-hero-4-container {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-4-image-box {
          flex: 1.3 1 0%;
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
        .hero-4-image-box.scrolled-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .hero-4-glow-bg {
          position: absolute;
          width: 580px;
          height: 580px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 65, 108, 0.28) 0%, rgba(255, 230, 0, 0.12) 50%, rgba(8, 10, 14, 0) 70%);
          filter: blur(85px);
          pointer-events: none;
        }
        .hero-4-img-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-4-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transform: scale(1.12);
          filter: drop-shadow(0 35px 50px rgba(0, 0, 0, 0.9));
          animation: floatBodyFluid 5s ease-in-out infinite;
        }
        @keyframes floatBodyFluid {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1.12); }
          50% { transform: translateY(-14px) rotate(1.2deg) scale(1.15); }
        }

        /* 🌟 Image ke upar 30 Days & Transformation Text Overlay */
        .transformation-overlay-title {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
          text-align: center;
          width: 100%;
          pointer-events: none;
        }
        .overlay-days {
          display: block;
          font-size: clamp(2.2rem, 4.2vw, 3.4rem);
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.85);
          margin-bottom: 2px;
        }
        .overlay-text {
          display: block;
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
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
          text-shadow: 0 4px 20px rgba(255, 61, 61, 0.45);
        }
        @keyframes yellowRedShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-4-text-wrap {
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
        .hero-4-text-wrap h2 {
          font-size: clamp(2.2rem, 4.5vw, 3.9rem);
          line-height: 1.15;
          margin: 0 0 20px 0;
          color: #ffffff;
          font-weight: 800;
        }
        .highlight {
          color: #ff5232;
        }
        .hero-desc {
          max-width: 500px;
          margin: 0 0 32px 0;
          line-height: 1.7;
          color: #94a3b8;
          font-size: 16px;
        }
        .hero-4-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          width: 100%;
        }

        @media (max-width: 968px) {
          .section-hero-4 {
            min-height: auto;
            padding: 40px 16px 60px;
          }
          .section-hero-4-container {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          .hero-4-image-box {
            order: 1;
            height: 60vh;
            min-height: 420px;
            max-height: 560px;
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            transform: translateX(0);
          }
          .hero-4-img {
            transform: scale(1.05);
          }
          .hero-4-text-wrap {
            order: 2;
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          .hero-4-actions {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

      {/* SEO & GEO Optimized Transformation Analysis Section */}
      <section className="section-hero-4" id="page-4" ref={sectionRef} aria-label="FullyWorkout AI Fitness Progress and Transformation Tracking">
        <div className="section-hero-4-container">

          <div className={`hero-4-image-box ${isVisible ? "scrolled-in" : ""}`}>
            <div className="hero-4-glow-bg"></div>

            <div className="hero-4-img-wrapper">
              {/* 🌟 Image ke upar 30 Days (White) & Transformation (Coloring) Text Overlay */}


              <img
                src="/body1.png"
                alt="FullyWorkout fitness progress and visual body transformation tracking"
                className="hero-4-img"
                loading="lazy"
              />
            </div>
          </div>

          <div className="hero-4-text-wrap">
            <div className="hero-badge">
              <span className="dot"></span>
              AI Fitness Progress & Transformation Tracking
            </div>
            <h2>
              Track Your Fitness<br />
              <span className="highlight">Progress & Transformation</span>
            </h2>
            <p className="hero-desc">
              Keep your fitness journey organized with visual progress tracking.
              Compare progress over time, review changes in your body and posture,
              and use your results to stay consistent with your personalized fitness plan.
            </p>

            <div className="hero-4-actions">
              <Link
                href="/onboarding"
                className="btn btn-primary btn-lg"
                style={{
                  flex: 1,
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                Start Tracking Your Progress →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}