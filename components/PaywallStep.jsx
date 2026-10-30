


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const plans = [
  { id: "weekly", name: "Weekly", price: 2.99, period: "week", daily: 3.99 / 7 },
  { id: "monthly", name: "Monthly", price: 8.99, period: "month", daily: 8.99 / 30, popular: true },
  { id: "yearly", name: "Yearly", price: 29.99, period: "year", daily: 29.99 / 365, bestValue: true },
];

export default function PaywallStep() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeStep = (nextStep) => {
    setDirection(nextStep > currentStep ? "forward" : "back");
    setCurrentStep(nextStep);
    setError("");
  };

  const startCheckout = async () => {
    if (!session?.user?.email) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dodo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || "Checkout start nahi ho paya.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err?.message || "Please dobara try karo.");
      setLoading(false);
    }
  };

  const selected = plans.find((plan) => plan.id === selectedPlan);

  return (
    <main className={`paywall ${currentStep === 3 ? "paywall-trial" : ""}`}>
      <style jsx>{`
        .paywall {
          min-height: 100vh;
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 12px;
          color: #111;
          background: #e6e6e6;
          font-family: Arial, Helvetica, sans-serif;
        }

        .card {
          width: 100%;
          max-width: 440px;
          min-height: min(760px, calc(100svh - 24px));
          display: flex;
          flex-direction: column;
          padding: 18px;
          overflow: hidden;
          border: 1px solid #ededed;
          border-radius: 22px;
          background: #eae8e8;
          box-shadow: 0 12px 45px rgba(0, 0, 0, 0.045);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 22px;
        }

        .brand {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .back {
          border: 0;
          padding: 5px;
          background: transparent;
          color: #666;
          font-size: 12px;
          cursor: pointer;
        }

        .progress {
          display: flex;
          gap: 6px;
          margin: 17px 0 12px;
        }

        .bar {
          height: 3px;
          flex: 1;
          border-radius: 8px;
          background: #e7e7e7;
        }

        .bar.active {
          background: #111;
        }

        .step-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          animation: ${direction === "forward" ? "slideForward" : "slideBack"} 0.28s ease both;
          min-height: 0;
        }

        .intro {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        h1 {
          margin: 10px 0 0;
          color: #111;
          font-size: clamp(27px, 7vw, 33px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .subtitle {
          margin: 9px 0 0;
          color: #666;
          font-size: 12px;
          line-height: 1.5;
          text-align: center;
        }

        .video-wrap {
          width: calc(100% + 24px);
          flex: 1;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 8px -12px;
          background: #e6e6e6;
        }

        .step-video {
          display: block;
          width: 100%;
          height: 100%;
          max-height: 64svh;
          object-fit: cover;
          object-position: center;
          transform: scale(1.2);
          background: #e6e6e6;
          border: 0;
          outline: 0;
          pointer-events: none;
          user-select: none;
        }

        .benefit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: 4px 0 10px;
          color: #222;
          font-size: 13px;
          font-weight: 700;
        }

        .check {
          font-size: 18px;
          font-weight: 900;
        }

        .footer {
          margin-top: auto;
          padding-top: 8px;
        }

        .cta {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          border: 0;
          border-radius: 12px;
          background: #080808;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s, background 0.15s;
        }

        .cta:hover {
          background: #242424;
        }

        .cta:active {
          transform: scale(0.99);
        }

        .cta:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .fineprint {
          margin: 9px 0 0;
          color: #888;
          font-size: 10px;
          line-height: 1.45;
          text-align: center;
        }

        .reminder-visual {
          width: 94px;
          height: 94px;
          display: grid;
          place-items: center;
          margin: 44px auto 22px;
          border: 1px solid #e8e8e8;
          border-radius: 50%;
          background: #f7f7f7;
          font-size: 40px;
        }

        .reminder-copy {
          max-width: 300px;
          margin: 12px auto;
          color: #666;
          font-size: 13px;
          line-height: 1.65;
        }

        .paywall-trial {
          padding: 0;
          display: block;
          background: #fff;
          min-height: 100vh;
          min-height: 100svh;
        }
        .trial-card {
          width: 100%;
          max-width: 440px;
          min-height: 100vh;
          min-height: 100svh;
          margin: 0 auto;
          padding: 0 18px 18px;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 0;
          box-shadow: none;
        }
        .trial-progress {
          height: 3px;
          flex: 0 0 3px;
          margin: 0 -18px 8px;
          overflow: hidden;
          background: #f0eafa;
        }
        .trial-progress span {
          display: block;
          width: 86%;
          height: 100%;
          background: #d9c2ff;
        }
        .trial-topbar {
          min-height: 24px;
          margin-bottom: 2px;
        }
        .trial-back {
          border: 0;
          padding: 0 3px;
          background: transparent;
          color: #b6b6b6;
          font-size: 27px;
          line-height: 1;
          cursor: pointer;
        }
        .restore {
          padding: 4px 0 4px 8px;
          color: #999;
          font-size: 10px;
        }
        .trial-screen {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
        .trial-heading {
          margin: clamp(14px, 3vh, 26px) 0 clamp(16px, 3vh, 24px);
          text-align: center;
          color: #090909;
          font-size: clamp(26px, 6.2vw, 32px);
          font-weight: 800;
          line-height: 1.14;
          letter-spacing: -0.65px;
        }
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: 0 8px 13px;
        }
        .timeline-row {
          position: relative;
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 10px;
          min-height: 59px;
        }
        .timeline-row:not(:last-child)::before {
          content: "";
          position: absolute;
          top: 24px;
          bottom: -1px;
          left: 10px;
          width: 5px;
          border-radius: 8px;
          background: #f4d39b;
        }
        .timeline-icon {
          position: relative;
          z-index: 1;
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #ff970b;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
        }
        .timeline-icon.dark {
          background: #111;
        }
        .timeline-title {
          margin: 2px 0 3px;
          color: #171717;
          font-size: 13px;
          font-weight: 800;
        }
        .timeline-text {
          margin: 0;
          color: #888;
          font-size: 11px;
          line-height: 1.35;
        }
        .trial-plans {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          margin: 8px 0 12px;
          padding-top: 2px;
        }
        .trial-plan {
          position: relative;
          width: 100%;
          min-width: 0;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border: 2px solid #c8c8c8;
          border-radius: 12px;
          background: #fff;
          color: #111;
          text-align: left;
          cursor: pointer;
        }
        .trial-plan.selected {
          border-color: #111;
          background: #f8f6f6;
        }
        .trial-plan-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          gap: 3px;
          padding-right: 4px;
        }
        .trial-plan-name {
          display: block;
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.2;
        }
        .trial-plan-price {
          display: inline;
          font-size: 15px;
          font-weight: 800;
          white-space: nowrap;
        }
        .trial-plan-note {
          display: inline;
          margin: 0 0 0 5px;
          color: #777;
          font-size: 13px;
          line-height: 1.3;
        }
        .trial-radio {
          position: static;
          flex: 0 0 20px;
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border: 1.5px solid #c5c5c5;
          border-radius: 50%;
          color: #fff;
          font-size: 11px;
        }
        .trial-plan.selected .trial-radio {
          border-color: #111;
          background: #111;
        }
        .trial-plan-badge {
          position: absolute;
          top: -8px;
          right: 38px;
          padding: 3px 7px;
          border-radius: 9px;
          background: #111;
          color: #fff;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }
        .trial-bottom {
          margin-top: 0;
          padding-top: 2px;
        }
        .trial-benefit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 0 0 13px;
          color: #171717;
          font-size: 12px;
          font-weight: 700;
        }
        .trial-cta {
          min-height: 50px;
          border-radius: 11px;
          gap: 5px;
        }
        .trial-cta-free {
          display: inline-block;
          padding: 1px 5px 2px;
          border-radius: 4px;
          color: #d7ff63;
          font-weight: 900;
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
          background: rgba(215, 255, 99, 0.12);
        }
        .trial-disclosure {
          margin: 8px 4px 0;
          color: #777;
          font-size: 9px;
          line-height: 1.4;
          text-align: center;
        }

        .pricing-title {
          margin-top: 12px;
          font-size: 28px;
        }

        .plans {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin-top: 20px;
        }

        .plan {
          min-width: 0;
          min-height: 155px;
          padding: 10px 7px;
          border: 1px solid #dedede;
          border-radius: 13px;
          background: #fff;
          color: #111;
          text-align: left;
          cursor: pointer;
        }

        .plan.chosen {
          padding: 9px 6px;
          border: 2px solid #111;
          background: #f7f7f7;
        }

        .plan-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3px;
        }

        .plan-name {
          font-size: 11px;
          font-weight: 800;
        }

        .radio {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border: 1px solid #bbb;
          border-radius: 50%;
          font-size: 9px;
        }

        .chosen .radio {
          border-color: #111;
          background: #111;
          color: #fff;
        }

        .badge {
          display: inline-block;
          margin-top: 8px;
          padding: 4px;
          border-radius: 4px;
          background: #111;
          color: #fff;
          font-size: 7px;
          font-weight: 800;
          white-space: nowrap;
        }

        .plan-price {
          margin-top: 11px;
          font-size: clamp(15px, 4vw, 22px);
          font-weight: 800;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .plan-period {
          margin-top: 3px;
          color: #777;
          font-size: 9px;
        }

        .plan-divider {
          height: 1px;
          margin: 10px 0 8px;
          background: #e4e4e4;
        }

        .daily-label {
          color: #777;
          font-size: 9px;
        }

        .daily-price {
          margin-top: 4px;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .selected-summary {
          margin-top: 16px;
          padding: 15px;
          border-radius: 13px;
          background: #111;
          color: #fff;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .summary-label {
          color: #bbb;
          font-size: 11px;
        }

        .summary-name {
          margin-top: 5px;
          font-size: 16px;
          font-weight: 800;
        }

        .summary-price {
          font-size: 23px;
          font-weight: 800;
          text-align: right;
        }

        .summary-period {
          margin-top: 3px;
          color: #bbb;
          font-size: 10px;
          text-align: right;
        }

        .error {
          margin-top: 10px;
          color: #b91c1c;
          font-size: 12px;
          line-height: 1.5;
          text-align: center;
        }

        .security-note {
          margin-top: 10px;
          color: #bbb;
          font-size: 9px;
          line-height: 1.5;
          text-align: center;
        }

        @keyframes slideForward {
          from {
            opacity: 0;
            transform: translateX(28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideBack {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 480px) {
          .paywall-trial {
            min-height: 100vh;
            min-height: 100svh;
            padding: 0;
          }
          .trial-card {
            width: 100%;
            max-width: none;
            min-height: 100vh;
            min-height: 100svh;
            padding: 0 14px 18px;
            border: 0;
            border-radius: 0;
          }
          .trial-progress { margin: 0 -14px 8px; }
          .trial-heading { margin: 18px 0 18px; font-size: clamp(25px, 6.8vw, 30px); }
          .timeline { margin: 0 2px 9px; }
          .timeline-row { min-height: 58px; grid-template-columns: 28px 1fr; gap: 9px; }
          .timeline-icon { width: 26px; height: 26px; font-size: 13px; }
          .timeline-row:not(:last-child)::before { left: 10px; top: 25px; width: 6px; }
          .timeline-title { font-size: 13px; }
          .timeline-text { font-size: 11px; line-height: 1.35; }
          .trial-plans { display: flex; flex-direction: column; gap: 9px; margin: 8px 0 10px; padding-top: 2px; }
          .trial-plan { width: 100%; min-height: 74px; padding: 12px 13px; border-radius: 11px; }
          .trial-plan-copy { gap: 4px; }
          .trial-plan-name { font-size: 14px; padding-right: 0; margin-bottom: 0; }
          .trial-plan-price { font-size: 13px; }
          .trial-plan-note { font-size: 11px; }
          .trial-radio { position: static; flex-basis: 19px; width: 19px; height: 19px; }
          .trial-plan-badge { top: -8px; right: 34px; left: auto; transform: none; font-size: 7px; padding: 3px 5px; }
          .trial-benefit { font-size: 13px; margin-bottom: 15px; }
          .trial-cta { min-height: 50px; font-size: 14px; }
          .trial-disclosure { margin-top: 10px; font-size: 10px; }
          .paywall.paywall-trial {
            display: block;
            width: 100%;
            padding: 0;
            background: #fff;
          }
          .card.trial-card {
            width: 100%;
            max-width: none;
            min-height: 100vh;
            min-height: 100svh;
            margin: 0;
            padding: 0 14px 18px;
            border: 0;
            border-radius: 0;
            box-shadow: none;
          }
          .paywall {
            padding: 8px;
          }

          .card {
            min-height: calc(100svh - 16px);
            padding: 15px 12px;
            border-radius: 18px;
          }

          .video-wrap {
            width: calc(100% + 24px);
            margin: 4px -12px;
          }

          .step-video {
            max-height: 64svh;
            object-fit: cover;
            transform: scale(1.1);
          }

          .benefit {
            margin-bottom: 7px;
          }

          .plans {
            gap: 5px;
          }

          .plan {
            padding: 9px 5px;
          }

          .plan.chosen {
            padding: 8px 4px;
          }

          .plan-name {
            font-size: 10px;
          }

          .plan-price {
            font-size: 15px;
          }

          .daily-price {
            font-size: 10px;
          }

          .badge {
            font-size: 6px;
          }
        }

        @media (max-height: 740px) {
          .trial-heading { margin: 16px 0 16px; }
          .timeline-row { min-height: 51px; }
          .trial-plans { gap: 7px; margin-top: 5px; margin-bottom: 7px; }
          .trial-plan { min-height: 66px; padding-top: 9px; padding-bottom: 9px; }
          .trial-plan-name { font-size: 13px; }
          .trial-plan-price { font-size: 12px; }
          .trial-plan-note { font-size: 10px; }
          .trial-benefit { margin-bottom: 8px; }
          .trial-disclosure { margin-top: 6px; }
        }

        @media (max-height: 700px) {
          .card {
            min-height: auto;
          }

          .video-wrap {
            min-height: 150px;
          }

          .step-video {
            max-height: 52svh;
          }

          .reminder-visual {
            margin: 22px auto 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .step-content {
            animation: none;
          }

          .cta {
            transition: none;
          }
        }
      `}</style>

      <section className={`card ${currentStep === 3 ? "trial-card" : ""}`}>
        {currentStep === 3 && (
          <div className="trial-progress">
            <span />
          </div>
        )}

        {currentStep > 1 && (
          <div className={`topbar ${currentStep === 3 ? "trial-topbar" : ""}`}>
            <button
              className={currentStep === 3 ? "trial-back" : "back"}
              type="button"
              aria-label="Go back"
              onClick={() => changeStep(currentStep - 1)}
            >
              {currentStep === 3 ? "‹" : "← Back"}
            </button>
            {currentStep === 3 && <span className="restore">Restore</span>}
          </div>
        )}

        {currentStep !== 3 && (
          <div className="progress">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`bar ${n <= currentStep ? "active" : ""}`}
              />
            ))}
          </div>
        )}

        <div key={currentStep} className="step-content">
          {currentStep === 1 && (
            <>
              <section className="intro">
                <h1>
                  Try FullyWorkout
                  <br />
                  for free
                </h1>

                <div className="video-wrap">
                  <video
                    className="step-video"
                    src="/step-1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    onClick={(event) => event.preventDefault()}
                    onContextMenu={(event) => event.preventDefault()}
                    aria-label="FullyWorkout feature preview"
                  />
                </div>

                <div className="benefit">
                  <span className="check">✓</span>
                  <span>No Payment Due Now</span>
                </div>
              </section>

              <div className="footer">
                <button
                  type="button"
                  className="cta"
                  onClick={() => changeStep(2)}
                >
                  Try for $0.00
                </button>

                <p className="fineprint">
                  Just $29.99 per year ($2.49/mo)
                </p>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <section className="intro">
                <div className="reminder-visual">🔔</div>

                <h1>
                  We’ll remind you
                  <br />
                  before your trial ends
                </h1>

                <p className="reminder-copy">
                  Review your membership details and billing terms before
                  continuing.
                </p>
              </section>

              <div className="footer">
                <button
                  type="button"
                  className="cta"
                  onClick={() => changeStep(3)}
                >
                  Continue →
                </button>

                <p className="fineprint">
                  Please review the plan terms on the next screen.
                </p>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <section className="trial-screen">
              <h1 className="trial-heading">
                Start your free trial<br />
                to continue.
              </h1>

              <div className="timeline">
                <div className="timeline-row">
                  <div className="timeline-icon">▣</div>
                  <div>
                    <div className="timeline-title">Today</div>
                    <p className="timeline-text">
                      Unlock all the app’s features like food scanning and workout tools.
                    </p>
                  </div>
                </div>

                <div className="timeline-row">
                  <div className="timeline-icon">♧</div>
                  <div>
                    <div className="timeline-title">Before your trial ends — Reminder</div>
                    <p className="timeline-text">
                      We’ll send you a reminder before your trial ends.
                    </p>
                  </div>
                </div>

                <div className="timeline-row">
                  <div className="timeline-icon dark">♛</div>
                  <div>
                    <div className="timeline-title">After your trial — Billing starts</div>
                    <p className="timeline-text">
                      You’ll be charged for your selected plan unless you cancel before billing starts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="trial-plans">
                {[
                  {
                    id: "weekly",
                    name: "Weekly",
                    price: "$2.99/wk",
                    note: "Billed weekly",
                    badge: "MOST POPULAR",
                  },
                  {
                    id: "monthly",
                    name: "Monthly",
                    price: "$8.99/mo",
                    note: "Billed monthly",
                  },
                  {
                    id: "yearly",
                    name: "Yearly",
                    price: "$2.49/mo",
                    note: "Billed yearly",
                    badge: "SAVE 86% ",
                  },
                ].map((plan) => {
                  const chosen = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      className={`trial-plan ${chosen ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setError("");
                      }}
                      aria-pressed={chosen}
                    >
                      {plan.badge && (
                        <span className="trial-plan-badge">{plan.badge}</span>
                      )}
                      <span className="trial-plan-copy">
                        <span className="trial-plan-name">{plan.name}</span>
                        <span>
                          <span className="trial-plan-price">{plan.price}</span>
                          <span className="trial-plan-note">{plan.note}</span>
                        </span>
                      </span>
                      <span className="trial-radio">{chosen ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>

              <div className="trial-bottom">
                <div className="trial-benefit">
                  <span className="check">✓</span>
                  <span>No Payment Due Now</span>
                </div>

                <button
                  type="button"
                  className="cta trial-cta"
                  onClick={startCheckout}
                  disabled={loading}
                >
                  {loading ? "Opening checkout..." : <>Start a <span className="trial-cta-free ">Free</span> Trial -- $0.00</>}
                </button>

                <p className="trial-disclosure">
                  1-day free trial, then {selectedPlan === "yearly"
                    ? "$29.99 per year ($2.49/mo)"
                    : selectedPlan === "weekly"
                      ? "$2.99 per week"
                      : "$8.99 per month"}, unless you cancel before billing starts.
                </p>

                {error && (
                  <div className="error" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </section>
    </main>
  );
}