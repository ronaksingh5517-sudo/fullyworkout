
"use client";

import { useState } from "react";

const creatorExamples = [
  {
    username: "@fitcreator",
    platform: "TikTok",
    views: "10,000",
    buyers: 100,
    earnings: "$149.70",
    progress: "24%",
    color: "#79a3ff",
  },
  {
    username: "@trainwithme",
    platform: "Instagram",
    views: "100,000",
    buyers: 1000,
    earnings: "$1,497.00",
    progress: "58%",
    color: "#b4a0ff",
  },
  {
    username: "@fitnessdaily",
    platform: "Reddit / X",
    views: "1,000,000",
    buyers: 10000,
    earnings: "$14,970.00",
    progress: "88%",
    color: "#79d9ff",
  },
];

const plans = [
  {
    name: "Weekly",
    description: "For people who want to try FullyWorkout.",
    features: [
      "Access to the weekly plan",
      "AI fitness features included in the plan",
      "Workout and nutrition tools",
      "Referral commission on eligible purchases",
    ],
  },
  {
    name: "Monthly",
    description: "For consistent fitness progress.",
    features: [
      "Access to the monthly plan",
      "AI fitness features included in the plan",
      "Workout and nutrition tools",
      "Referral commission on eligible purchases",
    ],
    featured: true,
  },
  {
    name: "Yearly",
    description: "For long-term fitness commitment.",
    features: [
      "Access to the yearly plan",
      "AI fitness features included in the plan",
      "Workout and nutrition tools",
      "Referral commission on eligible purchases",
    ],
  },
];

const faqs = [
  {
    q: "How does the affiliate program work?",
    a: "Eligible affiliates share their unique referral link. When a qualifying customer purchases a plan through that link, the purchase can be attributed to the affiliate according to the program's tracking and commission rules.",
  },
  {
    q: "How much commission can I earn?",
    a: "The example on this page uses a 30% commission rate. Actual earnings depend on the eligible purchase amount, successful referral attribution, refunds, and the final affiliate terms.",
  },
  {
    q: "How are the earnings examples calculated?",
    a: "The examples assume that 1% of views become buyers and use $4.99 as an illustrative purchase price. These are hypothetical calculations, not real results or guaranteed earnings.",
  },
  {
    q: "Do I need a large audience?",
    a: "Not necessarily. A smaller, engaged fitness audience can be valuable. Focus on relevant content, honest recommendations, and helping people discover tools that fit their goals.",
  },
  {
    q: "When will I receive my commission?",
    a: "Payment timing, minimum payout thresholds, verification, refund handling, and payout methods must follow the final affiliate program terms. Do not treat the sample amounts as approved or payable balances.",
  },
  {
    q: "Can I promote FullyWorkout on TikTok, Instagram, Reddit, and X?",
    a: "You can plan content for these platforms, but you must follow each platform's rules, disclose affiliate relationships where required, and avoid spam or misleading claims.",
  },
];

export default function AffiliatePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="fw-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .fw-page {
          --navy: #071126;
          --navy2: #0b1b3a;
          --panel: #102448;
          --blue: #7195ff;
          --blue-light: #a9c1ff;
          --white: #f4f7ff;
          --muted: #a7b7d5;
          --line: rgba(156, 180, 239, .17);
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #071126;
          color: var(--white);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          line-height: 1.6;
        }

        .fw-page a {
          color: inherit;
          text-decoration: none;
        }

        .fw-page button {
          font: inherit;
        }

        .fw-page button,
        .fw-page a {
          -webkit-tap-highlight-color: transparent;
        }

        .fw-container {
          width: min(1160px, calc(100% - 44px));
          margin-inline: auto;
        }

        .fw-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(1, 6, 12, 0.96);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(20px);
        }

        .fw-nav-inner {
          width: min(1240px, calc(100% - 44px));
          min-height: 76px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .fw-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: -.7px;
          white-space: nowrap;
        }


/* LOGO — RESPONSIVE ON ALL SCREEN SIZES */

.fw-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-shrink: 0;
}

.fw-logo-image {
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 0%;
  background: rgba(255, 255, 255, 0.30);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.fw-logo-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0%;
}

/* SMALL DESKTOP + TABLET */
@media (max-width: 1100px) {
  .fw-nav-inner {
    width: calc(100% - 32px);
    gap: 14px;
  }

  .fw-nav-links {
    gap: 14px;
  }

  .fw-nav-links > a {
    font-size: 12px;
  }

  .fw-nav-actions {
    gap: 12px;
  }

  .fw-logo-image {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
  }

  .fw-logo-text {
    font-size: 16px;
  }

  .fw-btn.fw-btn-primary {
    padding: 0 12px;
  }
}

/* TABLET — LINKS FIT INSIDE NAVBAR */
@media (min-width: 761px) and (max-width: 900px) {
  .fw-nav-inner {
    width: calc(100% - 24px);
    gap: 10px;
  }

  .fw-logo {
    gap: 7px;
  }

  .fw-logo-image {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .fw-logo-text {
    font-size: 15px;
  }

  .fw-nav-links {
    gap: 10px;
  }

  .fw-nav-links > a {
    font-size: 11px;
  }

  .fw-nav-actions {
    gap: 9px;
  }

  .fw-signin {
    font-size: 11px;
  }

  .fw-btn.fw-btn-primary {
    min-height: 38px;
    padding: 0 9px;
    font-size: 11px;
  }
}

/* MOBILE */
@media (max-width: 760px) {
  .fw-nav {
    height: 70px;
  }

  .fw-nav-inner {
    width: calc(100% - 24px);
    gap: 8px;
  }

  .fw-logo {
    gap: 8px;
  }

  .fw-logo-image {
    width: 50px;
    height: 50px;
    flex-basis: 50px;
  }

  .fw-logo-text {
    font-size: 16px;
  }
}

/* VERY NARROW PHONES */
@media (max-width: 360px) {
  .fw-nav-inner {
    width: calc(100% - 16px);
    gap: 5px;
  }

  .fw-logo {
    gap: 6px;
  }

  .fw-logo-text {
    font-size: 14px;
    letter-spacing: -0.4px;
  }

  .fw-nav-actions {
    gap: 8px;
  }

  .fw-signin {
    font-size: 11px;
  }

  .fw-menu-button {
    width: 35px;
    height: 35px;
  }
}


        .fw-logo-mark {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          color: white;
          font-size: 18px;
          background: linear-gradient(135deg, #7095ff, #4167e8);
          box-shadow: 0 7px 24px rgba(75, 111, 255, .24);
        }

        .fw-logo span:last-child span {
          color: #88a9ff;
        }

        .fw-nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
        }

        .fw-nav-links a,
        .fw-signin {
          color: #c4d0e9;
          font-size: 13px;
          font-weight: 650;
          transition: color .2s ease;
        }

        .fw-nav-links a:hover,
        .fw-signin:hover {
          color: #a9c1ff;
        }

        .fw-nav-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .fw-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 19px;
          border: 1px solid transparent;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease,
            border-color .2s ease, background .2s ease;
        }

        .fw-btn:hover {
          transform: translateY(-2px);
        }

        .fw-btn-primary {
          color: white;
          background: linear-gradient(135deg, #7195ff, #4d70ed);
          box-shadow: 0 9px 28px rgba(75, 111, 255, .2);
        }

        .fw-btn-primary:hover {
          box-shadow: 0 12px 32px rgba(75, 111, 255, .34);
        }

        .fw-btn-outline {
          color: #e4eaff;
          background: rgba(255, 255, 255, .035);
          border-color: rgba(182, 199, 240, .23);
        }

        .fw-btn-outline:hover {
          border-color: rgba(147, 178, 255, .6);
          background: rgba(96, 133, 255, .08);
        }

        .fw-menu-button {
          display: none;
          border: 1px solid var(--line);
          color: white;
          background: var(--navy2);
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
        }

        .fw-hero {
          position: relative;
          isolation: isolate;
          padding: 94px 0 78px;
          background:
            radial-gradient(ellipse at 80% 36%, rgba(66, 105, 214, .19), transparent 38%),
            radial-gradient(ellipse at 12% 0%, rgba(38, 73, 151, .13), transparent 43%),
            #071126;
        }

        .fw-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.04fr) minmax(0, .96fr);
          align-items: center;
          gap: 54px;
        }

        .fw-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          color: #a6beff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.8px;
          text-transform: uppercase;
        }

        .fw-label-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #85a6ff;
          box-shadow: 0 0 15px rgba(133, 166, 255, .75);
        }

        .fw-hero h1 {
          max-width: 650px;
          margin: 0;
          color: #f4f7ff;
          font-size: clamp(42px, 5.4vw, 70px);
          font-weight: 900;
          letter-spacing: -3.8px;
          line-height: 1.04;
        }

        .fw-gradient-text {
          color: #9ab5ff;
          background: linear-gradient(90deg, #8caaff, #c0ceff 58%, #7edbff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .fw-hero-copy {
          max-width: 530px;
          margin: 24px 0 0;
          color: #a7b7d5;
          font-size: 16px;
          line-height: 1.9;
        }

        .fw-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .fw-hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 17px;
          margin-top: 24px;
          color: #9baecc;
          font-size: 11px;
        }

        .fw-hero-trust span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .fw-hero-trust b {
          color: #91b1ff;
        }

        .fw-visual {
          position: relative;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        .fw-orbit {
          position: absolute;
          width: 330px;
          height: 330px;
          border: 1px solid rgba(126, 157, 255, .17);
          border-radius: 50%;
          box-shadow: 0 0 90px rgba(69, 103, 230, .08);
        }

        .fw-orbit:before,
        .fw-orbit:after {
          content: "";
          position: absolute;
          border: 1px solid rgba(126, 157, 255, .11);
          border-radius: 50%;
        }

        .fw-orbit:before {
          inset: 25px;
        }

        .fw-orbit:after {
          inset: 55px;
        }

        .fw-visual-glow {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: rgba(66, 105, 255, .12);
          filter: blur(45px);
        }

        .fw-visual-core {
          position: absolute;
          width: 150px;
          height: 150px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(144, 174, 255, .28);
          background: radial-gradient(circle, rgba(89, 126, 255, .18), rgba(8, 22, 49, .22) 70%);
          box-shadow: 0 0 70px rgba(79, 119, 255, .14);
          animation: fwPulse 4s ease-in-out infinite;
        }

        .fw-visual-core span {
          font-size: 56px;
          filter: drop-shadow(0 0 20px rgba(118, 158, 255, .3));
        }

        .fw-payout-card {
          position: absolute;
          z-index: 2;
          width: 236px;
          padding: 17px;
          border: 1px solid rgba(132, 164, 255, .3);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(24, 47, 91, .98), rgba(7, 19, 42, .98));
          box-shadow: 0 28px 70px rgba(0, 0, 0, .38),
            inset 0 1px 0 rgba(255, 255, 255, .08);
          backdrop-filter: blur(22px);
          animation: fwFloat 6s ease-in-out infinite;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .fw-payout-card:hover {
          border-color: rgba(147, 178, 255, .72);
          box-shadow: 0 35px 80px rgba(0, 0, 0, .45),
            0 0 35px rgba(83, 123, 255, .16);
        }

        .fw-payout-card.card-one {
          top: 27px;
          left: 0;
          transform: rotate(-5deg);
          animation-delay: -.7s;
        }

        .fw-payout-card.card-two {
          top: 166px;
          right: -4px;
          animation-delay: -2s;
        }

        .fw-payout-card.card-three {
          bottom: 10px;
          left: 38px;
          animation-delay: -3.2s;
        }

        .fw-payout-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 13px;
        }

        .fw-platform {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e9efff;
          font-size: 11px;
          font-weight: 850;
        }

        .fw-platform-icon {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: rgba(109, 145, 255, .16);
          border: 1px solid rgba(126, 157, 255, .16);
          font-size: 13px;
        }

        .fw-rate-pill {
          padding: 4px 7px;
          border-radius: 8px;
          color: #c7d7ff;
          background: rgba(84, 124, 255, .18);
          border: 1px solid rgba(124, 157, 255, .24);
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .fw-creator {
          margin-bottom: 3px;
          color: #aabbdc;
          font-size: 11px;
        }

        .fw-payout-amount {
          color: #f5f8ff;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.25;
          text-shadow: 0 0 22px rgba(112, 151, 255, .15);
        }

        .fw-payout-sub {
          margin-top: 4px;
          color: #91a4c8;
          font-size: 10px;
        }

        .fw-payout-progress {
          height: 4px;
          margin-top: 14px;
          overflow: hidden;
          border-radius: 10px;
          background: rgba(185, 203, 245, .12);
        }

        .fw-payout-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #527bff, #9ab8ff);
          box-shadow: 0 0 14px rgba(91, 132, 255, .5);
        }

        .fw-payout-bottom {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-top: 9px;
          color: #91a4c8;
          font-size: 9px;
        }

        .fw-visual-caption {
          position: absolute;
          right: 5px;
          bottom: -14px;
          color: #91a4c8;
          font-size: 10px;
          text-align: right;
        }

        .fw-section {
          position: relative;
          padding: 83px 0;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(57, 93, 186, .09), transparent 55%),
            #071126;
        }

        .fw-section-head {
          max-width: 710px;
          margin: 0 auto 43px;
          text-align: center;
        }

        .fw-section-head .fw-label {
          margin-bottom: 12px;
        }

        .fw-section-head h2 {
          margin: 0;
          color: #f4f7ff;
          font-size: clamp(30px, 4vw, 45px);
          font-weight: 900;
          letter-spacing: -1.8px;
          line-height: 1.15;
        }

        .fw-section-head p {
          margin: 15px 0 0;
          color: #a7b7d5;
          font-size: 14px;
          line-height: 1.85;
        }

        .fw-commission-band {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 25px 29px;
          border: 1px solid rgba(133, 164, 245, .2);
          border-radius: 19px;
          background: linear-gradient(135deg, #102650, #0a1934);
        }

        .fw-band-title {
          margin: 0;
          color: white;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -.6px;
        }

        .fw-band-sub {
          margin: 6px 0 0;
          color: #a7b7d5;
          font-size: 12px;
        }

        .fw-rate-box {
          flex-shrink: 0;
          padding: 13px 19px;
          border: 1px solid rgba(124, 157, 255, .23);
          border-radius: 14px;
          color: #a9c1ff;
          background: rgba(84, 124, 255, .15);
          text-align: center;
        }

        .fw-rate-box strong {
          display: block;
          font-size: 31px;
          font-weight: 950;
          line-height: 1.2;
        }

        .fw-rate-box span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .fw-commission-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 19px;
          margin-top: 24px;
        }

        .fw-commission-card,
        .fw-plan-card,
        .fw-step {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(138, 165, 232, .18);
          border-radius: 19px;
          color: #f4f7ff;
          background: linear-gradient(145deg, #102448, #0b1933);
          box-shadow: 0 16px 42px rgba(0, 0, 0, .14);
          transition: transform .25s ease, border-color .25s ease,
            box-shadow .25s ease;
        }

        .fw-commission-card {
          padding: 24px;
        }

        .fw-commission-card:before {
          content: "";
          position: absolute;
          top: -70px;
          right: -60px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(85, 125, 255, .24), transparent 72%);
          pointer-events: none;
        }

        .fw-commission-card:hover,
        .fw-plan-card:hover,
        .fw-step:hover {
          transform: translateY(-5px);
          border-color: rgba(113, 151, 255, .55);
          box-shadow: 0 25px 60px rgba(0, 0, 0, .28),
            0 0 25px rgba(79, 119, 255, .09);
        }

        .fw-card-index {
          color: #a3b2d0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .fw-sales-label,
        .fw-earn-label {
          color: #a3b2d0;
          font-size: 11px;
        }

        .fw-sales-amount {
          margin: 4px 0 15px;
          color: #f4f7ff;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -.7px;
        }

        .fw-card-divider,
        .fw-plan-rule {
          height: 1px;
          margin: 15px 0;
          background: rgba(177, 197, 243, .15);
        }

        .fw-earn-amount {
          margin-top: 4px;
          color: #8eafff;
          font-size: 31px;
          font-weight: 950;
          letter-spacing: -1px;
        }

        .fw-card-detail {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 9px;
          color: #a7b7d5;
          font-size: 11px;
        }

        .fw-commission-note {
          max-width: 850px;
          margin: 22px auto 0;
          color: #91a4c8;
          font-size: 11px;
          line-height: 1.8;
          text-align: center;
        }

        .fw-plan-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          align-items: stretch;
        }

        .fw-plan-card {
          display: flex;
          flex-direction: column;
          padding: 28px 25px 24px;
        }

        .fw-plan-card.featured {
          border-color: rgba(111, 148, 255, .75);
          box-shadow: 0 18px 48px rgba(45, 83, 190, .16);
        }

        .fw-plan-card.featured:before {
          content: "POPULAR";
          position: absolute;
          top: 15px;
          right: -29px;
          width: 120px;
          padding: 5px 0;
          color: white;
          background: #527bfa;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1px;
          text-align: center;
          transform: rotate(38deg);
        }

        .fw-plan-eyebrow {
          color: #a3b2d0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .fw-plan-card h3 {
          margin: 9px 0 7px;
          color: #f4f7ff;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -.7px;
        }

        .fw-plan-card p {
          min-height: 48px;
          margin: 0;
          color: #a7b7d5;
          font-size: 12px;
          line-height: 1.8;
        }

        .fw-plan-list {
          display: grid;
          gap: 13px;
          margin: 20px 0 25px;
          padding: 0;
          list-style: none;
        }

        .fw-plan-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #c3d0e8;
          font-size: 12px;
          line-height: 1.7;
        }

        .fw-check {
          display: inline-grid;
          flex-shrink: 0;
          place-items: center;
          width: 19px;
          height: 19px;
          border: 1px solid rgba(126, 157, 255, .19);
          border-radius: 7px;
          color: #c3d4ff;
          background: rgba(83, 123, 255, .17);
          font-size: 11px;
          font-weight: 900;
        }

        .fw-plan-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(177, 197, 243, .15);
          color: #91a4c8;
          font-size: 10px;
          line-height: 1.7;
        }

        .fw-plan-card .fw-btn {
          width: 100%;
          margin-top: 17px;
        }

        .fw-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .fw-step {
          padding: 24px 20px;
        }

        .fw-step-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 19px;
          border: 1px solid rgba(126, 157, 255, .19);
          border-radius: 13px;
          color: #c3d4ff;
          background: rgba(83, 123, 255, .17);
          font-size: 13px;
          font-weight: 950;
        }

        .fw-step h3 {
          margin: 0 0 9px;
          color: #f4f7ff;
          font-size: 16px;
          font-weight: 850;
        }

        .fw-step p {
          margin: 0;
          color: #a7b7d5;
          font-size: 12px;
          line-height: 1.85;
        }

        .fw-cta {
          padding: 55px 0 75px;
          background: #071126;
        }

        .fw-cta-panel {
          position: relative;
          overflow: hidden;
          padding: 55px 25px;
          border: 1px solid rgba(137, 164, 238, .17);
          border-radius: 24px;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(85, 120, 224, .19), transparent 65%),
            #071126;
          text-align: center;
        }

        .fw-cta-panel h2 {
          max-width: 700px;
          margin: 0 auto;
          color: #f4f7ff;
          font-size: clamp(30px, 4vw, 45px);
          font-weight: 900;
          letter-spacing: -1.8px;
          line-height: 1.17;
        }

        .fw-cta-panel p {
          max-width: 570px;
          margin: 16px auto 24px;
          color: #a7b7d5;
          font-size: 13px;
          line-height: 1.85;
        }

        .fw-faq-list {
          max-width: 830px;
          margin: auto;
        }

        .fw-faq-item {
          border-bottom: 1px solid rgba(172, 194, 240, .16);
        }

        .fw-faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          width: 100%;
          padding: 21px 2px;
          border: 0;
          color: #f4f7ff;
          background: transparent;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
        }

        .fw-faq-plus {
          flex-shrink: 0;
          color: #8baaff;
          font-size: 23px;
          font-weight: 400;
          transition: transform .2s ease;
        }

        .fw-faq-answer {
          padding: 0 32px 20px 2px;
          color: #a7b7d5;
          font-size: 12px;
          line-height: 1.9;
        }

        .fw-footer {
          padding: 30px 0;
          border-top: 1px solid rgba(137, 164, 238, .15);
          background: #071126;
        }

        .fw-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .fw-footer-copy {
          color: #8fa2c4;
          font-size: 10px;
        }

        .fw-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .fw-footer-links a {
          color: #a7b7d5;
          font-size: 10px;
        }

        .fw-footer-links a:hover {
          color: #c0d0ff;
        }

        @keyframes fwFloat {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -10px; }
        }

        @keyframes fwPulse {
          0%, 100% { transform: scale(1); opacity: .9; }
          50% { transform: scale(1.06); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fw-page *,
          .fw-page *:before,
          .fw-page *:after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }

        @media (max-width: 980px) {
          .fw-nav-links {
            gap: 17px;
          }

          .fw-hero-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .fw-hero-copy {
            max-width: 650px;
          }

          .fw-visual {
            width: min(560px, 100%);
            margin: 0 auto;
          }

          .fw-steps-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .fw-plan-grid {
            gap: 13px;
          }

          .fw-plan-card {
            padding: 23px 18px;
          }
        }

        @media (max-width: 680px) {
          .fw-container {
            width: calc(100% - 34px);
          }

          .fw-nav-inner {
            width: calc(100% - 30px);
            min-height: 66px;
          }

          .fw-logo {
            font-size: 17px;
          }

          .fw-logo-mark {
            width: 33px;
            height: 33px;
          }

          .fw-menu-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .fw-nav-actions {
            gap: 10px;
          }

          .fw-nav-actions .fw-signin {
            display: none;
          }

          .fw-nav-actions > .fw-btn {
            min-height: 39px;
            padding: 0 12px;
            font-size: 11px;
          }

          .fw-nav-links {
            position: absolute;
            top: 65px;
            left: 0;
            right: 0;
            display: none;
            align-items: stretch;
            gap: 0;
            padding: 8px 17px 14px;
            border-bottom: 1px solid rgba(141, 169, 239, .18);
            background: #0b1b3a;
            box-shadow: 0 18px 35px rgba(0, 0, 0, .3);
          }

          .fw-nav-links.is-open {
            display: flex;
            flex-direction: column;
          }

          .fw-nav-links a {
            padding: 12px 5px;
            border-bottom: 1px solid rgba(141, 169, 239, .1);
            color: #e0e8fa;
          }

          .fw-hero {
            padding: 61px 0 50px;
          }

          .fw-hero h1 {
            font-size: clamp(39px, 11vw, 55px);
            letter-spacing: -2.4px;
          }

          .fw-hero-copy {
            margin-top: 18px;
            font-size: 14px;
          }

          .fw-hero-actions {
            align-items: stretch;
          }

          .fw-hero-actions .fw-btn {
            flex: 1 1 155px;
          }

          .fw-hero-trust {
            gap: 11px;
            font-size: 10px;
          }

          .fw-visual {
            min-height: 370px;
            transform: scale(.96);
            transform-origin: center top;
            margin-bottom: -12px;
          }

          .fw-orbit {
            width: 270px;
            height: 270px;
          }

          .fw-visual-core {
            width: 120px;
            height: 120px;
          }

          .fw-visual-core span {
            font-size: 44px;
          }

          .fw-payout-card {
            width: 204px;
            padding: 13px;
          }

          .fw-payout-card.card-one {
            top: 15px;
            left: -3px;
          }

          .fw-payout-card.card-two {
            top: 137px;
            right: -6px;
          }

          .fw-payout-card.card-three {
            bottom: 0;
            left: 0;
          }

          .fw-payout-amount {
            font-size: 24px;
          }

          .fw-visual-caption {
            right: 0;
            bottom: -22px;
            max-width: 210px;
            font-size: 9px;
          }

          .fw-section {
            padding: 61px 0;
          }

          .fw-section-head {
            margin-bottom: 29px;
          }

          .fw-section-head h2 {
            font-size: 32px;
            letter-spacing: -1.2px;
          }

          .fw-section-head p {
            font-size: 12px;
          }

          .fw-commission-band {
            align-items: flex-start;
            flex-direction: column;
            padding: 22px;
          }

          .fw-band-title {
            font-size: 20px;
          }

          .fw-rate-box {
            width: 100%;
          }

          .fw-commission-grid,
          .fw-plan-grid {
            grid-template-columns: 1fr;
          }

          .fw-commission-card {
            padding: 22px;
          }

          .fw-plan-card {
            padding: 25px 22px;
          }

          .fw-plan-card p {
            min-height: 0;
          }

          .fw-steps-grid {
            grid-template-columns: 1fr;
          }

          .fw-step {
            padding: 22px;
          }

          .fw-cta {
            padding: 35px 0 55px;
          }

          .fw-cta-panel {
            padding: 39px 20px;
          }

          .fw-cta-panel h2 {
            font-size: 32px;
            letter-spacing: -1.2px;
          }

          .fw-footer-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .fw-footer-links {
            gap: 14px;
          }
        }

        @media (max-width: 370px) {
          .fw-logo {
            gap: 6px;
            font-size: 15px;
          }

          .fw-nav-actions > .fw-btn {
            padding: 0 9px;
          }

          .fw-payout-card {
            width: 188px;
          }

          .fw-payout-card.card-two {
            right: -10px;
          }

          .fw-payout-amount {
            font-size: 22px;
          }
        }
      `}</style>


      {/* RESPONSIVE NAVIGATION */}
      <header className="fw-nav">
        <div className="fw-nav-inner">
          <a className="fw-logo" href="/" aria-label="FullyWorkout home">
            <span className="fw-logo-image">
              <img
                src="/favicon.png"
                alt="FullyWorkout logo"
              />
            </span>

            <span className="fw-logo-text">
              Fully<span>Workout</span>
            </span>
          </a>

          <nav
            className={`fw-nav-links ${menuOpen ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a href="#commission" onClick={() => setMenuOpen(false)}>
              Commission
            </a>

            <a href="#plans" onClick={() => setMenuOpen(false)}>
              Plans
            </a>

            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>

            <a href="#faqs" onClick={() => setMenuOpen(false)}>
              FAQs
            </a>

            <a
              className="fw-mobile-apply"
              href="/login"
              onClick={() => setMenuOpen(false)}
            >
              Start Now <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <div className="fw-nav-actions">
            <a className="fw-signin" href="/login">
              Sign in
            </a>

            <a className="fw-btn fw-btn-primary" href="/login">
              Start Now <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              className="fw-menu-button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="fw-hero">
        <div className="fw-container fw-hero-grid">
          <div>
            <div className="fw-label">
              <span className="fw-label-dot" />
              FULLYWORKOUT PARTNER PROGRAM
            </div>

            <h1>
              Turn Your Fitness
              <br />
              Influence Into
              <br />
              <span className="fw-gradient-text">Extra Income.</span>
            </h1>

            <p className="fw-hero-copy">
              Create fitness content, share tools you believe in, and
              introduce your audience to FullyWorkout. Build your community
              while exploring the potential of affiliate commissions.
            </p>

            <div className="fw-hero-actions">
              <a className="fw-btn fw-btn-primary" href="/affiliate/apply">
                Join the Partner Program <span aria-hidden="true">→</span>
              </a>
              <a className="fw-btn fw-btn-outline" href="#how-it-works">
                See How It Works
              </a>
            </div>

            <div className="fw-hero-trust">
              <span><b>✓</b> Fitness-focused creators</span>
              <span><b>✓</b> Social content opportunities</span>
              <span><b>✓</b> Referral-based commissions</span>
            </div>
          </div>

          <div
            className="fw-visual"
            aria-label="Illustrative affiliate commission cards"
          >
            <div className="fw-orbit" />
            <div className="fw-visual-glow" />
            <div className="fw-visual-core">
              <span aria-hidden="true">⚡</span>
            </div>

            {creatorExamples.map((creator, index) => (
              <div
                className={`fw-payout-card card-${["one", "two", "three"][index]}`}
                key={creator.username}
              >
                <div className="fw-payout-top">
                  <div className="fw-platform">
                    <span
                      className="fw-platform-icon"
                      style={{ color: creator.color }}
                    >
                      {index === 0 ? "♪" : index === 1 ? "◎" : "↗"}
                    </span>
                    {creator.platform}
                  </div>
                  <span className="fw-rate-pill">30% example</span>
                </div>

                <div className="fw-creator">{creator.username}</div>
                <div className="fw-payout-amount">{creator.earnings}</div>
                <div className="fw-payout-sub">
                  Illustrative commission estimate
                </div>

                <div className="fw-payout-progress">
                  <span style={{ width: creator.progress }} />
                </div>

                <div className="fw-payout-bottom">
                  <span>{creator.views} views</span>
                  <span>{creator.buyers.toLocaleString()} assumed buyers</span>
                </div>
              </div>
            ))}

            <div className="fw-visual-caption">
              Hypothetical examples only · Not actual payouts
            </div>
          </div>
        </div>
      </section>

      {/* COMMISSION */}
      <section className="fw-section" id="commission">
        <div className="fw-container">
          <div className="fw-section-head">
            <div className="fw-label">THE COMMISSION MODEL</div>
            <h2>
              Your content can create
              <br />
              <span className="fw-gradient-text">new opportunities.</span>
            </h2>
            <p>
              Understand how views, buyer conversion, plan price, and
              commission rate can affect a referral estimate.
            </p>
          </div>

          <div className="fw-commission-band">
            <div>
              <h3 className="fw-band-title">A simple example to understand the math</h3>
              <p className="fw-band-sub">
                Assumed commission rate: 30% · Assumed view-to-buyer conversion: 1%
              </p>
            </div>
            <div className="fw-rate-box">
              <strong>30%</strong>
              <span>Example commission rate</span>
            </div>
          </div>

          <div className="fw-commission-grid">
            {creatorExamples.map((creator, index) => (
              <article className="fw-commission-card" key={creator.username}>
                <div className="fw-card-index">
                  EXAMPLE 0{index + 1} · {creator.platform.toUpperCase()}
                </div>

                <div style={{ marginTop: 19 }}>
                  <div className="fw-sales-label">Assumed content views</div>
                  <div className="fw-sales-amount">{creator.views}</div>
                </div>

                <div className="fw-card-divider" />

                <div>
                  <div className="fw-earn-label">Assumed buyers at 1%</div>
                  <div className="fw-sales-amount">
                    {creator.buyers.toLocaleString()}
                  </div>
                </div>

                <div className="fw-card-divider" />

                <div className="fw-earn-label">
                  Estimated commission using $4.99 per purchase
                </div>
                <div className="fw-earn-amount">{creator.earnings}</div>

                <div className="fw-card-detail">
                  <span>Example purchase price</span>
                  <span>$4.99</span>
                </div>
                <div className="fw-card-detail">
                  <span>Commission rate</span>
                  <span>30%</span>
                </div>
              </article>
            ))}
          </div>

          <p className="fw-commission-note">
            Important: These examples use an assumed 1% conversion rate and
            an illustrative $4.99 purchase price. They are not forecasts,
            actual affiliate results, or guaranteed earnings. Actual
            commissions depend on the real plan price, approved program
            terms, eligible purchases, referral attribution, refunds, and
            any applicable adjustments. Confirm your actual commission
            terms before publishing these figures as an offer.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="fw-section" id="plans">
        <div className="fw-container">
          <div className="fw-section-head">
            <div className="fw-label">FITNESS PLANS</div>
            <h2>
              One fitness platform.
              <br />
              <span className="fw-gradient-text">Different goals.</span>
            </h2>
            <p>
              Introduce your audience to the subscription duration that
              suits their needs. Check the live checkout for current pricing
              and included features.
            </p>
          </div>

          <div className="fw-plan-grid">
            {plans.map((plan) => (
              <article
                className={`fw-plan-card ${plan.featured ? "featured" : ""}`}
                key={plan.name}
              >
                <div className="fw-plan-eyebrow">FULLYWORKOUT PLAN</div>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>

                <div className="fw-plan-rule" />

                <ul className="fw-plan-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span className="fw-check">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="fw-plan-footer">
                  Plan prices and exact entitlements should match your
                  current FullyWorkout checkout.
                </div>

                <a className="fw-btn fw-btn-outline" href="/login">
                  Explore FullyWorkout <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="fw-section" id="how-it-works">
        <div className="fw-container">
          <div className="fw-section-head">
            <div className="fw-label">GET STARTED</div>
            <h2>
              From fitness content
              <br />
              <span className="fw-gradient-text">to referrals.</span>
            </h2>
            <p>
              A clear path for creators who want to introduce their
              audience to fitness and wellness tools.
            </p>
          </div>

          <div className="fw-steps-grid">
            <article className="fw-step">
              <div className="fw-step-number">01</div>
              <h3>Apply to join</h3>
              <p>
                Share your creator profile and the platforms where you
                publish fitness-related content.
              </p>
            </article>

            <article className="fw-step">
              <div className="fw-step-number">02</div>
              <h3>Get approved</h3>
              <p>
                Your application and promotion methods should be reviewed
                before affiliate access is granted.
              </p>
            </article>

            <article className="fw-step">
              <div className="fw-step-number">03</div>
              <h3>Share your link</h3>
              <p>
                Publish useful, honest content and direct interested
                viewers to FullyWorkout through your assigned referral link.
              </p>
            </article>

            <article className="fw-step">
              <div className="fw-step-number">04</div>
              <h3>Track eligible sales</h3>
              <p>
                Eligible referrals and commission balances should be
                calculated using the actual tracking and payment system.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="fw-cta">
        <div className="fw-container">
          <div className="fw-cta-panel">
            <div className="fw-label">YOUR NEXT STEP</div>
            <h2>
              Make your fitness content
              <br />
              <span className="fw-gradient-text">work harder for you.</span>
            </h2>
            <p>
              Build trust with your audience, create helpful fitness
              content, and explore the FullyWorkout partner opportunity.
            </p>
            <a className="fw-btn fw-btn-primary" href="/affiliate/apply">
              Become a Partner <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="fw-section" id="faqs">
        <div className="fw-container">
          <div className="fw-section-head">
            <div className="fw-label">QUESTIONS & ANSWERS</div>
            <h2>
              Frequently asked
              <br />
              <span className="fw-gradient-text">questions.</span>
            </h2>
            <p>
              Important details about referrals, commission estimates,
              creator content, and payouts.
            </p>
          </div>

          <div className="fw-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div className="fw-faq-item" key={faq.q}>
                  <button
                    type="button"
                    className="fw-faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span>{faq.q}</span>
                    <span className="fw-faq-plus" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="fw-faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fw-footer">
        <div className="fw-container fw-footer-inner">
          <a className="fw-logo" href="/" aria-label="FullyWorkout home">
            <span className="fw-logo-mark">F</span>
            <span>Fully<span>Workout</span></span>
          </a>

          <div className="fw-footer-copy">
            © {new Date().getFullYear()} FullyWorkout. All rights reserved.
          </div>

          <nav className="fw-footer-links" aria-label="Footer navigation">
            <a href="/">Home</a>
            <a href="/login">Sign in</a>
            <a href="#faqs">FAQs</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
