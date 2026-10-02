"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PricingSection() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (planName, amountInUSD) => {
    const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TelPp9rlg1o7RG";

    if (amountInUSD === 0) {
      window.location.href = "/ai-coach";
      return;
    }

    const amountInINRValue = Math.round(amountInUSD * 98);

    const options = {
      key: RAZORPAY_KEY,
      amount: amountInINRValue * 100,
      currency: "INR",
      name: "FullyWorkout AI Pro",
      description: `${planName} Subscription Plan ($${amountInUSD})`,
      handler: async function (response) {
        alert(`🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

        try {
          const userEmail = session?.user?.email;
          if (userEmail) {
            await fetch("/api/user/upgrade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: userEmail,
                plan: planName.toLowerCase(),
                membership: `${planName} Plan`,
                paymentId: response.razorpay_payment_id,
              })
            });

            if (update) {
              await update({ isPro: true });
            }
          }
        } catch (err) {
          console.error("Database upgrade sync error:", err);
        }

        localStorage.setItem("aurafit_is_pro", "true");
        window.location.href = "/ai-coach";
      },
      prefill: {
        name: session?.user?.name || "FullyWorkout User",
        email: session?.user?.email || "user@fullyworkout.ai",
        contact: "9999999999",
      },
      theme: {
        color: "#ff5232",
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK failed to load. Please check your connection.");
    }
  };

  return (
    <>
      <style jsx>{`
        .pricing-grid-updated {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 36px;
        }
        .card {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          border-radius: 1.5rem;
          background-color: rgba(18, 22, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.8rem 1.5rem;
          position: relative;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          justify-content: space-between;
        }
        .card:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 75, 43, 0.4);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 75, 43, 0.15);
        }
        .card.featured {
          background: linear-gradient(180deg, rgba(30, 20, 28, 0.9) 0%, rgba(16, 19, 28, 0.9) 100%);
          border: 1px solid rgba(255, 75, 43, 0.5);
          box-shadow: 0 16px 40px rgba(255, 75, 43, 0.2);
        }
        .pricing-badge-popular {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .pricing-badge-save {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ffe600, #ff8c00);
          color: #000000;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .price-wrap {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 0.5rem;
        }
        .price {
          font-size: 2.8rem;
          line-height: 1;
          font-weight: 800;
          color: #fff;
        }
        .price span {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }
        .plan-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }
        .plan-desc {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }
        .lists {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          row-gap: 0.75rem;
          font-size: 0.875rem;
          color: #fff;
        }
        .list {
          display: flex;
          align-items: center;
        }
        .list svg {
          height: 1rem;
          width: 1rem;
          flex-shrink: 0;
        }
        .list span {
          margin-left: 0.75rem;
          color: #cbd5e1;
          font-size: 13px;
        }
        .action {
          margin-top: 2rem;
          width: 100%;
          border: 2px solid #fff;
          border-radius: 9999px;
          background-color: #fff;
          padding: 0.625rem 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: #000;
          cursor: pointer;
          display: block;
          text-decoration: none;
          transition: all .2s ease;
        }
        .action:hover {
          color: #fff;
          background-color: transparent;
          border-color: #ff5232;
        }
        .action.featured-btn {
          background-color: #ff5232;
          border-color: #ff5232;
          color: #ffffff;
        }
        .action.featured-btn:hover {
          background-color: transparent;
          border-color: #ffffff;
        }
      `}</style>

      <section className="section" id="pricing" style={{ background: "#080a0e", padding: "90px 20px 70px" }}>
        <div className="container" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{
              display: "inline-block", fontSize: "13px", fontWeight: 900, letterSpacing: "2px",
              textTransform: "uppercase", color: "#ff5232", background: "rgba(255, 82, 50, 0.1)",
              padding: "6px 16px", borderRadius: "20px", border: "1px solid rgba(255, 82, 50, 0.3)", marginBottom: "12px"
            }}>
              PRICING PLANS
            </span>
            <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#fff", fontWeight: 900, marginTop: "4px" }}>
              Start free. Upgrade as you transform.
            </h2>
          </div>

          <div className="pricing-grid-updated">
            {/* Free Plan */}
            <div className="card">
              <div>
                <div className="price-wrap"><div className="price">$0</div><span>/ lifetime</span></div>
                <div className="plan-title">Free</div>
                <div className="plan-desc">Get started with essentials</div>
                <ul className="lists">
                  <li className="list"><span>1 Body Scan / day</span></li>
                  <li className="list"><span>1 Food Scan / day</span></li>
                  <li className="list"><span>✨ 5 AI Chat Msgs / day</span></li>
                </ul>
              </div>
              <button onClick={() => handlePayment("Free", 0)} className="action">Get started</button>
            </div>

            {/* Weekly Plan */}
            <div className="card">
              <div>
                <div className="price-wrap"><div className="price">$4.99</div><span>/ week</span></div>
                <div className="plan-title">Weekly</div>
                <div className="plan-desc">Flexible trial sprint</div>
                <ul className="lists">
                  <li className="list"><span>✨ 100% Ad-Free</span></li>
                  <li className="list"><span>3 Body Scans / day</span></li>
                  <li className="list"><span>5 Food Scans / day</span></li>
                  <li className="list"><span>20 AI Chat Msgs / day</span></li>
                </ul>
              </div>
              <button onClick={() => handlePayment("Weekly", 0.001)} className="action">Get started</button>
            </div>

            {/* Monthly Plan ($12.99) */}
            <div className="card featured">
              <span className="pricing-badge-popular">MOST POPULAR</span>
              <div>
                <div className="price-wrap"><div className="price" style={{ color: "#ff5232" }}>$12.99</div><span>/ month</span></div>
                <div className="plan-title">Monthly</div>
                <div className="plan-desc">Full 30-day AI power</div>
                <ul className="lists">
                  <li className="list"><span>✨ 100% Ad-Free</span></li>
                  <li className="list"><span>5 Body Scans / day</span></li>
                  <li className="list"><span>10 Food Scans / day</span></li>
                  <li className="list"><span>30 AI Chat Msgs / day</span></li>
                </ul>
              </div>
              <button onClick={() => handlePayment("Monthly", 0.001)} className="action featured-btn">Get started</button>
            </div>

            {/* Yearly Plan ($99) */}
            <div className="card">
              <span className="pricing-badge-save">SAVE 36%</span>
              <div>
                <div className="price-wrap"><div className="price">$99</div><span>/ year</span></div>
                <div className="plan-title">Yearly</div>
                <div className="plan-desc">Complete long-term journey</div>
                <ul className="lists">
                  <li className="list"><span>⚡ 10 Body Scans / day</span></li>
                  <li className="list"><span>⚡ 50 Food Scans / day</span></li>
                  <li className="list"><span>⚡ 100 AI Chat Msgs / day</span></li>
                </ul>
              </div>
              <button onClick={() => handlePayment("Yearly", 0.001)} className="action">Get started</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}









































