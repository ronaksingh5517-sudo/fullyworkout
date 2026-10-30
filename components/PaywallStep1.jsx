// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// const plans = [
//   { id: "weekly", name: "Weekly", price: 2.99, period: "week", daily: 2.99 / 7 },
//   { id: "monthly", name: "Monthly", price: 8.99, period: "month", daily: 8.99 / 30, popular: true },
//   { id: "yearly", name: "Yearly", price: 29.99, period: "year", daily: 29.99 / 365, bestValue: true },
// ];

// export default function PaywallStep() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [direction, setDirection] = useState("forward");
//   const [selectedPlan, setSelectedPlan] = useState("monthly");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const changeStep = (nextStep) => {
//     setDirection(nextStep > currentStep ? "forward" : "back");
//     setCurrentStep(nextStep);
//     setError("");
//   };

//   const startCheckout = async () => {
//     if (!session?.user?.email) {
//       router.push("/login");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/dodo/checkout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ plan: selectedPlan }),
//       });

//       const data = await response.json();
//       if (!response.ok || !data.success || !data.checkoutUrl) {
//         throw new Error(data.error || "Checkout start nahi ho paya.");
//       }

//       window.location.href = data.checkoutUrl;
//     } catch (err) {
//       setError(err?.message || "Please dobara try karo.");
//       setLoading(false);
//     }
//   };

//   const selected = plans.find((plan) => plan.id === selectedPlan);

//   return (
//     <main className="paywall">
//       <style jsx>{`
//         .paywall {
//           min-height: 100vh;
//           min-height: 100svh;
//           display: grid;
//           place-items: center;
//           padding: 12px;
//           color: #111;
//           background: #e6e6e6;
//           font-family: Arial, Helvetica, sans-serif;
//         }
//         .card {
//           width: 100%;
//           max-width: 440px;
//           min-height: min(760px, calc(100svh - 24px));
//           display: flex;
//           flex-direction: column;
//           padding: 18px;
//           overflow: hidden;
//           border: 1px solid #ededed;
//           border-radius: 22px;
//           background: #eae8e8;
//           box-shadow: 0 12px 45px rgba(0,0,0,.045);
//         }
//         .topbar { display:flex; align-items:center; justify-content:space-between; min-height:22px; }
//         .brand { font-size:10px; font-weight:800; letter-spacing:2px; }
//         .back { border:0; padding:5px; background:transparent; color:#666; font-size:12px; cursor:pointer; }
//         .progress { display:flex; gap:6px; margin:17px 0 12px; }
//         .bar { height:3px; flex:1; border-radius:8px; background:#e7e7e7; }
//         .bar.active { background:#111; }
//         .step-content { flex:1; display:flex; flex-direction:column; animation: ${direction === "forward" ? "slideForward" : "slideBack"} .28s ease both; min-height:0; }
//         .intro { flex:1; min-height:0; display:flex; flex-direction:column; align-items:center; text-align:center; }
//         h1 { margin:10px 0 0; color:#111; font-size:clamp(27px, 7vw, 33px); font-weight:800; line-height:1.1; letter-spacing:-1px; }
//         .subtitle { margin:9px 0 0; color:#666; font-size:12px; line-height:1.5; text-align:center; }
//         .video-wrap { width:calc(100% + 24px); flex:1; min-height:180px; display:flex; align-items:center; justify-content:center; overflow:hidden; margin:8px -12px; background:#e6e6e6; }
//         .step-video { display:block; width:100%; height:100%; max-height:64svh; object-fit:cover; object-position:center; transform:scale(1.20); background:#e6e6e6; border:0; outline:0; pointer-events:none; user-select:none; }
//         .benefit { display:flex; align-items:center; justify-content:center; gap:7px; margin:4px 0 10px; color:#222; font-size:13px; font-weight:700; }
//         .check { font-size:18px; font-weight:900; }
//         .footer { margin-top:auto; padding-top:8px; }
//         .cta { width:100%; min-height:50px; display:flex; align-items:center; justify-content:center; padding:14px; border:0; border-radius:12px; background:#080808; color:#fff; font-size:14px; font-weight:800; cursor:pointer; transition:transform .15s, background .15s; }
//         .cta:hover { background:#242424; }
//         .cta:active { transform:scale(.99); }
//         .cta:disabled { opacity:.65; cursor:wait; }
//         .fineprint { margin:9px 0 0; color:#888; font-size:10px; line-height:1.45; text-align:center; }
//         .reminder-visual { width:94px; height:94px; display:grid; place-items:center; margin:44px auto 22px; border:1px solid #e8e8e8; border-radius:50%; background:#f7f7f7; font-size:40px; }
//         .reminder-copy { max-width:300px; margin:12px auto; color:#666; font-size:13px; line-height:1.65; }
//         .pricing-title { margin-top:12px; font-size:28px; }
//         .plans { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:7px; margin-top:20px; }
//         .plan { min-width:0; min-height:155px; padding:10px 7px; border:1px solid #dedede; border-radius:13px; background:#fff; color:#111; text-align:left; cursor:pointer; }
//         .plan.chosen { padding:9px 6px; border:2px solid #111; background:#f7f7f7; }
//         .plan-header { display:flex; align-items:center; justify-content:space-between; gap:3px; }
//         .plan-name { font-size:11px; font-weight:800; }
//         .radio { width:15px; height:15px; flex-shrink:0; display:grid; place-items:center; border:1px solid #bbb; border-radius:50%; font-size:9px; }
//         .chosen .radio { border-color:#111; background:#111; color:#fff; }
//         .badge { display:inline-block; margin-top:8px; padding:4px; border-radius:4px; background:#111; color:#fff; font-size:7px; font-weight:800; white-space:nowrap; }
//         .plan-price { margin-top:11px; font-size:clamp(15px,4vw,22px); font-weight:800; letter-spacing:-.5px; white-space:nowrap; }
//         .plan-period { margin-top:3px; color:#777; font-size:9px; }
//         .plan-divider { height:1px; margin:10px 0 8px; background:#e4e4e4; }
//         .daily-label { color:#777; font-size:9px; }
//         .daily-price { margin-top:4px; font-size:11px; font-weight:800; white-space:nowrap; }
//         .selected-summary { margin-top:16px; padding:15px; border-radius:13px; background:#111; color:#fff; }
//         .summary-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
//         .summary-label { color:#bbb; font-size:11px; }
//         .summary-name { margin-top:5px; font-size:16px; font-weight:800; }
//         .summary-price { font-size:23px; font-weight:800; text-align:right; }
//         .summary-period { margin-top:3px; color:#bbb; font-size:10px; text-align:right; }
//         .error { margin-top:10px; color:#b91c1c; font-size:12px; line-height:1.5; text-align:center; }
//         .security-note { margin-top:10px; color:#bbb; font-size:9px; line-height:1.5; text-align:center; }
//         @keyframes slideForward { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
//         @keyframes slideBack { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
//         @media (max-width:480px) {
//           .paywall { padding:8px; }
//           .card { min-height:calc(100svh - 16px); padding:15px 12px; border-radius:18px; }
//           .video-wrap { width:calc(100% + 24px); margin:4px -12px; }
//           .step-video { max-height:64svh; object-fit:cover; transform:scale(1.10); }
//           .benefit { margin-bottom:7px; }
//           .plans { gap:5px; }
//           .plan { padding:9px 5px; }
//           .plan.chosen { padding:8px 4px; }
//           .plan-name { font-size:10px; }
//           .plan-price { font-size:15px; }
//           .daily-price { font-size:10px; }
//           .badge { font-size:6px; }
//         }
//         @media (max-height:700px) {
//           .card { min-height:auto; }
//           .video-wrap { min-height:150px; }
//           .step-video { max-height:52svh; }
//           .reminder-visual { margin:22px auto 15px; }
//         }
//         @media (prefers-reduced-motion:reduce) {
//           .step-content { animation:none; }
//           .cta { transition:none; }
//         }
//       `}</style>

//       <section className="card">
//         {currentStep > 1 && (
//           <div className="topbar">
//             <button className="back" type="button" onClick={() => changeStep(currentStep - 1)}>← Back</button>
//           </div>
//         )}

//         <div className="progress">
//           {[1, 2, 3].map((n) => <div key={n} className={`bar ${n <= currentStep ? "active" : ""}`} />)}
//         </div>

//         <div key={currentStep} className="step-content">
//           {currentStep === 1 && (
//             <>
//               <section className="intro">
//                 <h1>Try FullyWorkout<br />for free</h1>
//                 <div className="video-wrap">
//                   <video
//                     className="step-video"
//                     src="/step-1.mp4"
//                     autoPlay
//                     muted
//                     loop
//                     playsInline
//                     preload="auto"
//                     controls={false}
//                     disablePictureInPicture
//                     onClick={(event) => event.preventDefault()}
//                     onContextMenu={(event) => event.preventDefault()}
//                     aria-label="FullyWorkout feature preview"
//                   />
//                 </div>
//                 <div className="benefit"><span className="check">✓</span><span>No Payment Due Now</span></div>
//               </section>
//               <div className="footer">
//                 <button type="button" className="cta" onClick={() => changeStep(2)}>Try for $0.00</button>
//                 <p className="fineprint">Just $29.99 per year ($2.49/mo)</p>
//               </div>
//             </>
//           )}

//           {currentStep === 2 && (
//             <>
//               <section className="intro">
//                 <div className="reminder-visual">🔔</div>
//                 <h1>We’ll remind you<br />before your trial ends</h1>
//                 <p className="reminder-copy">Review your membership details and billing terms before continuing.</p>
//               </section>
//               <div className="footer">
//                 <button type="button" className="cta" onClick={() => changeStep(3)}>Continue →</button>
//                 <p className="fineprint">Please review the plan terms on the next screen.</p>
//               </div>
//             </>
//           )}

//           {currentStep === 3 && (
//             <>
//               <h1 className="pricing-title">Choose your plan</h1>
//               <p className="subtitle">Select a plan for your fitness journey.</p>
//               <div className="plans">
//                 {plans.map((plan) => {
//                   const chosen = selectedPlan === plan.id;
//                   return (
//                     <button key={plan.id} type="button" className={`plan ${chosen ? "chosen" : ""}`} onClick={() => { setSelectedPlan(plan.id); setError(""); }} aria-pressed={chosen}>
//                       <div className="plan-header"><span className="plan-name">{plan.name}</span><span className="radio">{chosen ? "✓" : ""}</span></div>
//                       {plan.popular && <span className="badge">POPULAR</span>}
//                       {plan.bestValue && <span className="badge">BEST VALUE</span>}
//                       <div className="plan-price">${plan.price.toFixed(2)}</div>
//                       <div className="plan-period">per {plan.period}</div>
//                       <div className="plan-divider" />
//                       <div className="daily-label">Daily cost</div>
//                       <div className="daily-price">${plan.daily.toFixed(2)}/day</div>
//                     </button>
//                   );
//                 })}
//               </div>
//               <div className="selected-summary">
//                 <div className="summary-row">
//                   <div><div className="summary-label">Selected plan</div><div className="summary-name">{selected?.name}</div></div>
//                   <div><div className="summary-price">${selected?.price.toFixed(2)}</div><div className="summary-period">per {selected?.period}</div></div>
//                 </div>
//                 <button type="button" className="cta" style={{ marginTop: 14 }} onClick={startCheckout} disabled={loading}>
//                   {loading ? "Opening checkout..." : "Continue to checkout →"}
//                 </button>
//                 <div className="security-note">Secure checkout powered by DodoPayments. Review the final price and billing terms before paying.</div>
//               </div>
//               {error && <div className="error" role="alert">{error}</div>}
//             </>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }










"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const plans = [
  { id: "weekly", name: "Weekly", price: 2.99, period: "week", daily: 2.99 / 7 },
  { id: "monthly", name: "Monthly", price: 8.99, period: "month", daily: 8.99 / 30, popular: true },
  { id: "yearly", name: "Yearly", price: 29.99, period: "year", daily: 29.99 / 365, bestValue: true },
];

export default function PaywallStep() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
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
    <main className="paywall">
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

      <section className="card">
        {currentStep > 1 && (
          <div className="topbar">
            <button
              className="back"
              type="button"
              onClick={() => changeStep(currentStep - 1)}
            >
              ← Back
            </button>
          </div>
        )}

        <div className="progress">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`bar ${n <= currentStep ? "active" : ""}`}
            />
          ))}
        </div>

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
            <>
              <h1 className="pricing-title">Choose your plan</h1>

              <p className="subtitle">
                Select a plan for your fitness journey.
              </p>

              <div className="plans">
                {plans.map((plan) => {
                  const chosen = selectedPlan === plan.id;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      className={`plan ${chosen ? "chosen" : ""}`}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setError("");
                      }}
                      aria-pressed={chosen}
                    >
                      <div className="plan-header">
                        <span className="plan-name">{plan.name}</span>
                        <span className="radio">{chosen ? "✓" : ""}</span>
                      </div>

                      {plan.popular && (
                        <span className="badge">POPULAR</span>
                      )}

                      {plan.bestValue && (
                        <span className="badge">BEST VALUE</span>
                      )}

                      <div className="plan-price">
                        ${plan.price.toFixed(2)}
                      </div>

                      <div className="plan-period">per {plan.period}</div>

                      <div className="plan-divider" />

                      <div className="daily-label">Daily cost</div>

                      <div className="daily-price">
                        ${plan.daily.toFixed(2)}/day
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="selected-summary">
                <div className="summary-row">
                  <div>
                    <div className="summary-label">Selected plan</div>
                    <div className="summary-name">{selected?.name}</div>
                  </div>

                  <div>
                    <div className="summary-price">
                      ${selected?.price.toFixed(2)}
                    </div>
                    <div className="summary-period">
                      per {selected?.period}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="cta"
                  style={{ marginTop: 14 }}
                  onClick={startCheckout}
                  disabled={loading}
                >
                  {loading
                    ? "Opening checkout..."
                    : "Continue to checkout →"}
                </button>

                <div className="security-note">
                  Secure checkout powered by DodoPayments. Review the final
                  price and billing terms before paying.
                </div>
              </div>

              {error && (
                <div className="error" role="alert">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}