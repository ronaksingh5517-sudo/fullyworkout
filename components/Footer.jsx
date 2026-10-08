"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Camera,
  ScanLine,
  Bot,
  TrendingUp,
  Dumbbell,
  BarChart3,
  CreditCard,
  User,
  Phone,
  Mail,
  MessageCircle,
  Shield,
  FileText,
  RotateCcw,
  Cookie,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleAnchorClick = (e, targetId) => {
    if (pathname === "/") {
      e.preventDefault();

      const el = document.querySelector(targetId);

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      e.preventDefault();
      router.push("/" + targetId);
    }
  };

  return (
    <>
      <style jsx>{`
        .fullyworkout-footer {
          background: #040508 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 70px 24px 30px;
          color: #94a3b8;
          font-size: 14px;
        }

        .fullyworkout-footer-container {
          max-width: 1240px;
          margin: 0 auto;
        }

        .fullyworkout-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #ffffff;
        }

        .brand-logo-img {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          object-fit: contain;
        }

        .brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .fullyworkout-footer-brand p {
          margin-top: 16px;
          line-height: 1.65;
          color: #94a3b8;
          max-width: 320px;
        }

        .fullyworkout-footer-col h4 {
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 18px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .fullyworkout-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .fullyworkout-footer-links li {
          margin: 0;
          padding: 0;
        }

        .fullyworkout-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 13px;
          color: #64748b;
        }

        .fullyworkout-bottom-nav {
          display: flex;
          gap: 20px;
        }

        .b-nav-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .b-nav-link:hover {
          color: #cbd5e1;
        }

        @media (max-width: 900px) {
          .fullyworkout-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 580px) {
          .fullyworkout-footer {
            padding: 50px 16px 25px;
          }

          .fullyworkout-footer-grid {
            grid-template-columns: 1fr;
            gap: 34px;
          }

          .fullyworkout-footer-brand p {
            max-width: 100%;
          }

          .fullyworkout-footer-bottom {
            flex-direction: column;
            gap: 14px;
            text-align: center;
          }

          .fullyworkout-bottom-nav {
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px 20px;
          }
        }
      `}</style>

      <footer
        className="fullyworkout-footer"
        role="contentinfo"
        aria-label="FullyWorkout Footer"
      >
        <div className="fullyworkout-footer-container">

          <div className="fullyworkout-footer-grid">

            {/* =========================
                BRAND
            ========================= */}

            <div className="fullyworkout-footer-brand">

              <Link
                href="/"
                className="brand-logo-wrap"
                aria-label="FullyWorkout Home"
              >
                <img
                  src="/favicon.png"
                  alt="FullyWorkout Logo"
                  className="brand-logo-img"
                />

                <span className="brand-title">
                  FullyWorkout
                </span>
              </Link>

              <p>
                FullyWorkout is an AI-powered fitness platform for
                personalized workouts, nutrition tracking, AI food scanning,
                body analysis, and fitness progress tracking.
              </p>

            </div>

            {/* =========================
                AI FEATURES
            ========================= */}

            <div className="fullyworkout-footer-col">

              <h4>AI Features</h4>

              <ul className="fullyworkout-footer-links">

                <li>
                  <Link
                    href="/food-scanner"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Camera
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>AI Food Scanner</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/body-scan"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <ScanLine
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>AI Body Scan</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/ai-coach"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Bot
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>AI Fitness Coach</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/progress"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <TrendingUp
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Fitness Progress Tracking</span>
                  </Link>
                </li>

              </ul>

            </div>

            {/* =========================
                PLATFORM
            ========================= */}

            <div className="fullyworkout-footer-col">

              <h4>Platform</h4>

              <ul className="fullyworkout-footer-links">

                <li>
                  <Link
                    href="/workout"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Dumbbell
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Personalized Workouts</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/progress"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <BarChart3
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Fitness Progress</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <CreditCard
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Pricing Plans</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/author"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <User
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>About FullyWorkout</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Phone
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Contact FullyWorkout</span>
                  </Link>
                </li>

              </ul>

            </div>

            {/* =========================
                SUPPORT & LEGAL
            ========================= */}

            <div className="fullyworkout-footer-col">

              <h4>Support & Legal</h4>

              <ul className="fullyworkout-footer-links">

                <li>
                  <a
                    href="mailto:ronaksingh5517@gmail.com"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Mail
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Email Support</span>
                  </a>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <MessageCircle
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Contact Support</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/privacy"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Shield
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Privacy Policy</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <FileText
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Terms of Service</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/refund"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <RotateCcw
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Refund Policy</span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/cookies"
                    className="flex items-center gap-4 text-[15px] text-slate-400 transition-all duration-200 hover:translate-x-[3px] hover:text-[#ff5232]"
                  >
                    <Cookie
                      className="h-5 w-5 shrink-0"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    <span>Cookie Policy</span>
                  </Link>
                </li>

              </ul>

            </div>

          </div>

          {/* =========================
              FOOTER BOTTOM
          ========================= */}

          <div className="fullyworkout-footer-bottom">

            <div>
              © 2026 FullyWorkout. All rights reserved.
            </div>

            <div className="fullyworkout-bottom-nav">

              <Link
                href="/author"
                className="b-nav-link"
              >
                Author
              </Link>

              <Link
                href="/contact"
                className="b-nav-link"
              >
                Contact
              </Link>

              <Link
                href="/dashboard"
                className="b-nav-link"
              >
                App Dashboard
              </Link>

            </div>

          </div>

        </div>
      </footer>
    </>
  );
}