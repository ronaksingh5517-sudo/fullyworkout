"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleAnchorClick = (e, targetId) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
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
        .author-meta-box {
          margin-top: 14px;
          background: rgba(56, 189, 248, 0.05);
          border: 1px solid rgba(56, 189, 248, 0.15);
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          color: #cbd5e1;
        }
        .author-meta-box span {
          color: #38bdf8;
          font-weight: 700;
        }
        .fullyworkout-footer-col h4 {
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 18px;
          text-transform: uppercase;
        }
        .fullyworkout-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .f-link {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .f-link:hover {
          color: #ff5232;
          transform: translateX(3px);
        }
        .fullyworkout-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #4ade80;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          margin-top: 14px;
        }
        .fullyworkout-status-dot {
          width: 7px;
          height: 7px;
          background: #22c55e;
          border-radius: 50%;
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
          }
          .fullyworkout-footer-bottom {
            flex-direction: column;
            gap: 14px;
            text-align: center;
          }
        }
      `}</style>

      <footer className="fullyworkout-footer" role="contentinfo">
        <div className="fullyworkout-footer-container">
          <div className="fullyworkout-footer-grid">
            
            {/* Brand Logo, CEO Info & Founder Meta for SEO/GEO */}
            <div className="fullyworkout-footer-brand">
              <Link href="/" className="brand-logo-wrap" aria-label="FullyWorkout Home">
                <img 
                  src="/favicon.png" 
                  alt="FullyWorkout Logo" 
                  className="brand-logo-img" 
                />
                <span className="brand-title">FullyWorkout</span>
              </Link>
              <p>
                FullyWorkout is your ultimate next-gen AI fitness platform & calorie intelligence engine. Established on 10/1/2026 to revolutionize global training.
              </p>
              
             

              <div className="fullyworkout-status-badge">
                <span className="fullyworkout-status-dot"></span> Fully workout AI Engines Active (v2.6)
              </div>
            </div>

            {/* AI Features */}
            <div className="fullyworkout-footer-col">
              <h4>AI Features</h4>
              <ul className="fullyworkout-footer-links">
                <li><Link href="/food-scanner" className="f-link">📸 Food Scanner</Link></li>
                <li><Link href="/body-scan" className="f-link">⚡ Body Scan Analysis</Link></li>
                <li><Link href="/dashboard" className="f-link">📊 Visual Transformation</Link></li>
                <li><Link href="/ai-coach" className="f-link">🤖 Your Coach </Link></li>
              </ul>
            </div>

            {/* Platform & Author Links */}
            <div className="fullyworkout-footer-col">
              <h4>Platform</h4>
              <ul className="fullyworkout-footer-links">
                <li><Link href="/dashboard" className="f-link">🏠 User Dashboard</Link></li>
                <li><Link href="/workout/gym-transformation" className="f-link">🏋️ Daily Workout Player</Link></li>
                <li><Link href="/author" className="f-link">👨‍💻 About Author </Link></li>
                <li><Link href="/contact" className="f-link">📞 Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact & Support Details */}
            <div className="fullyworkout-footer-col">
              <h4>Support & Direct</h4>
              <ul className="fullyworkout-footer-links">
                <li><a href="mailto:ronaksingh5517@gmail.com" className="f-link">✉️ ronaksingh5517@gmail.com</a></li>
                <li><Link href="/contact" className="f-link">💬 Support Form</Link></li>
                <li><Link href="/#pricing" className="f-link" onClick={(e) => handleAnchorClick(e, "#pricing")}>💳 Pricing Plans</Link></li>
                <li><Link href="/onboarding" className="f-link">🚀 Start Free (30 Days)</Link></li>
              </ul>
            </div>

          </div>

          <div className="fullyworkout-footer-bottom">
            <div>© 2026 FullyWorkout. All rights reserved. CEO: Ronak Singh.</div>
            <div className="fullyworkout-bottom-nav">
              <Link href="/author" className="b-nav-link">Author</Link>
              <Link href="/contact" className="b-nav-link">Contact</Link>
              <Link href="/dashboard" className="b-nav-link">App Dashboard</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}