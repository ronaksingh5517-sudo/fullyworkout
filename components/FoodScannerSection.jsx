"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FoodScannerSection() {
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
        .section-hero-3 {
          position: relative;
          min-height: 96vh;
          display: flex;
          align-items: center;
          background: #080a0e !important;
          padding: 70px 24px;
          overflow: hidden;
        }
        .section-hero-3-container {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-3-text-wrap {
          flex: 1 1 0%;
          max-width: 540px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          z-index: 2;
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
        .hero-3-text-wrap h2 {
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
        .hero-3-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          width: 100%;
        }
        .hero-3-image-box {
          flex: 1.2 1 0%;
          width: 100%;
          height: 88vh;
          max-height: 820px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(80px) scale(0.95);
          transition: opacity 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-3-image-box.scrolled-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .hero-3-glow-bg {
          position: absolute;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 75, 43, 0.35) 0%, rgba(255, 65, 108, 0.12) 45%, rgba(8, 10, 14, 0) 70%);
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-3-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transform: scale(1.15);
          filter: drop-shadow(0 35px 50px rgba(0, 0, 0, 0.9));
          animation: floatBurgerFluid 4.6s ease-in-out infinite;
        }
        @keyframes floatBurgerFluid {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1.15); }
          50% { transform: translateY(-16px) rotate(1.8deg) scale(1.18); }
        }
        .hero-3-pill {
          position: absolute;
          z-index: 3;
          padding: 12px 18px;
          border-radius: 14px;
          background: rgba(18, 22, 32, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(10px);
          color: #ffffff;
          box-shadow: 0 15px 30px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pill-top-right {
          top: 35px;
          right: 25px;
        }
        .pill-bottom-left {
          bottom: 40px;
          left: 15px;
        }
        .pill-stat-val {
          font-size: 18px;
          font-weight: 800;
          color: #ff5232;
        }
        .pill-stat-lbl {
          font-size: 12px;
          color: #94a3b8;
        }
        @media (max-width: 968px) {
          .section-hero-3 {
            min-height: auto;
            padding: 40px 16px 60px;
          }
          .section-hero-3-container {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }
          .hero-3-image-box {
            order: 1;
            height: 60vh;
            min-height: 420px;
            max-height: 560px;
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
            transform: translateX(0);
          }
          .hero-3-img {
            transform: scale(1.08);
          }
          .hero-3-text-wrap {
            order: 2;
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          .hero-3-actions {
            justify-content: center;
            width: 100%;
          }
          .hero-3-pill {
            display: none;
          }
        }
      `}</style>

      <section
        className="section-hero-3"
        id="page-3"
        ref={sectionRef}
        aria-label="FullyWorkout AI Food Scanner for Calories and Nutrition"
      >
        <div className="section-hero-3-container">

          <div className="hero-3-text-wrap">
            <div className="hero-badge">
              <span className="dot"></span>
              AI Food Scanner & Nutrition Tracking
            </div>

            <h2>
              Scan Your Food<br />
              & Track <span className="highlight">Nutrition</span>
            </h2>
            <p className="hero-desc">
              Take a photo of your meal and let FullyWorkout use AI-powered food
              recognition to identify foods and estimate calories and macronutrients.
              Quickly log your nutrition and keep your fitness goals on track.
            </p>
            <div className="hero-3-actions">
              <Link href="/food-scanner" className="btn btn-primary btn-lg" style={{ flex: 1, textAlign: "center", justifyContent: "center" }}>
             Scan Your Meal →
              </Link>
            </div>
          </div>

          <div className={`hero-3-image-box ${isVisible ? "scrolled-in" : ""}`}>
            <div className="hero-3-glow-bg"></div>

            <div className="hero-3-pill pill-top-right">
              <span style={{ fontSize: "24px" }}>🍔</span>
              <div>
                <div className="pill-stat-val">540 kcal</div>
                <div className="pill-stat-lbl">Estimated from meal photo</div>
              </div>
            </div>

            <div className="hero-3-pill pill-bottom-left">
              <span style={{ fontSize: "24px" }}>🥩</span>
              <div>
                <div className="pill-stat-val">32g Protein</div>
                <div className="pill-stat-lbl">Example nutrition estimate</div>
              </div>
            </div>

            <img
              src="/burger.png"
              alt="FullyWorkout AI food scanner for meal and nutrition analysis"
              className="hero-3-img"
              loading="lazy"
            />
          </div>

        </div>
      </section>
    </>
  );
}