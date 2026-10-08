"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroVideo() {
  const [activeUsers, setActiveUsers] = useState(52322);

  // Load saved count from localStorage on initial page load so it never resets on refresh
  useEffect(() => {
    const savedCount = localStorage.getItem("aurafit_live_users");
    if (savedCount) {
      setActiveUsers(parseInt(savedCount, 10));
    }
  }, []);

  // Continuous organic counter running 24/7 with sequential stepping & saving state
  useEffect(() => {
    const interval = setInterval(() => {
      const randomStep = Math.floor(Math.random() * 5) + 1; // Random increment between 1 and 5

      setActiveUsers((currentVal) => {
        const targetValue = currentVal + randomStep;

        // Step through intermediate numbers smoothly
        const stepInterval = setInterval(() => {
          setActiveUsers((prev) => {
            if (prev < targetValue) {
              const nextVal = prev + 1;
              localStorage.setItem("aurafit_live_users", nextVal.toString()); // Save progress live
              return nextVal;
            } else {
              clearInterval(stepInterval);
              return prev;
            }
          });
        }, 70);

        return currentVal;
      });

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx>{`
        .hero-responsive-section {
          position: relative;
          min-height: 94vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 110px 20px 50px;
          text-align: center;
          background: #080a0e !important;
        }
        .hero-video-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.75;
          filter: brightness(0.9) contrast(1.05);
          z-index: 0;
          pointer-events: none;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(8, 10, 14, 0.3) 0%, rgba(8, 10, 14, 0.72) 65%, #080a0e 100%);
          z-index: 1;
        }
        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
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
        .hero-actions-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .hero-stats-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px;
        }
        .highlight {
          color: #ff5232;
        }

        .stat-value {
          display: inline-block;
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 768px) {
          .hero-responsive-section {
            min-height: 90vh;
            padding: 95px 16px 40px;
          }
          .hero-actions-group .btn {
            width: 100%;
            text-align: center;
          }
          .hero-stats-group {
            gap: 18px;
          }
        }
      `}</style>

      <section className="hero hero-responsive-section" aria-label="AI-Powered Fitness and Workout Platform">
        <video autoPlay loop muted playsInline className="hero-video-bg">
          <source src="/videos/hero-gym.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content-wrapper">
          <div className="fade-in">
            <div className="hero-badge" style={{ marginLeft: "auto", marginRight: "auto" }}>
              <span className="dot"></span>
              Globally Transformation Platform
            </div>
            <h1
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.15,
                marginBottom: "18px",
              }}
            >
              AI Fitness Coach for
              <br />
              <span className="highlight">
                Personalized Workouts & Transformation
              </span>
            </h1>
            <p
              className="hero-desc"
              style={{
                maxWidth: "700px",
                margin: "0 auto 30px auto",
              }}
            >
              FullyWorkout is an AI-powered fitness platform that creates personalized
              workout plans, analyzes your body, scans meals, tracks nutrition, and helps
              you follow a structured 30-day fitness transformation journey.
            </p>
            <div className="hero-actions-group">
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Start Your Free Fitness Plan →
              </Link>

              <a href="#page-2" className="btn btn-secondary btn-lg">
                 How FullyWorkout Works →
              </a>
            </div>
            <div className="hero-stats-group">
              <div className="stat-item">
                <div className="stat-value">
                  {activeUsers.toLocaleString()}+
                </div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4.9★</div>
                <div className="stat-label">App Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">92%</div>
                <div className="stat-label">See Results</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}