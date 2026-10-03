"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PricingSection() {
  const { data: session, update } = useSession();

  /* ==========================================
     RAZORPAY SCRIPT
  ========================================== */

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /* ==========================================
     PAYMENT FUNCTION
  ========================================== */

  const handlePayment = async (planName, amountInUSD) => {
    const RAZORPAY_KEY =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "rzp_live_TelPp9rlg1o7RG";

    if (amountInUSD === 0) {
      window.location.href = "/ai-coach";
      return;
    }

    const userEmail = session?.user?.email;

    if (!userEmail) {
      alert(
        "Your login session is still loading. Please wait a moment and try again."
      );
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
        try {
          const upgradeResponse = await fetch("/api/user/upgrade", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
              plan: planName.toLowerCase(),
              membership: `${planName} Plan`,
              paymentId: response.razorpay_payment_id,
            }),
          });

          const upgradeData = await upgradeResponse.json();

          if (!upgradeResponse.ok || !upgradeData?.success) {
            throw new Error(
              upgradeData?.error ||
                "Subscription activation failed"
            );
          }

          if (update) {
            await update({
              isPro: true,
              plan: planName.toLowerCase(),
            });
          }

          localStorage.setItem(
            "aurafit_is_pro",
            "true"
          );

          localStorage.setItem(
            "aurafit_plan",
            planName.toLowerCase()
          );

          alert(
            `🎉 ${planName} Plan activated successfully!`
          );

          window.location.href = "/ai-coach";
        } catch (err) {
          console.error(
            "Database upgrade sync error:",
            err
          );

          alert(
            "Payment successful, but your plan could not be activated. Please refresh and try again."
          );
        }
      },

      prefill: {
        name:
          session?.user?.name ||
          "FullyWorkout User",
        email: userEmail,
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
      alert(
        "Razorpay SDK failed to load. Please check your connection."
      );
    }
  };;

  /* ==========================================
     UI
  ========================================== */

  return (
    <>
      <style jsx>{`

        /* ======================================
           PRICING GRID
        ====================================== */

        .pricing-grid-updated {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 20px;

          margin-top: 36px;

          width: 100%;
        }


        /* ======================================
           CARD
        ====================================== */

        .card {
          max-width: 100%;

          min-width: 0;

          display: flex;

          flex-direction: column;

          border-radius: 1.5rem;

          background-color:
            rgba(18, 22, 32, 0.85);

          border:
            1px solid
            rgba(255, 255, 255, 0.1);

          /*
            Increased from 1.8rem 1.5rem
            so bigger text has enough space
          */

          padding:
            2rem 1.6rem;

          position: relative;

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          transition:
            all 0.3s ease;

          justify-content:
            space-between;

          box-sizing:
            border-box;

          height: 100%;
        }


        .card:hover {
          transform:
            translateY(-6px);

          border-color:
            rgba(255, 75, 43, 0.4);

          box-shadow:
            0 16px 36px
            rgba(0, 0, 0, 0.6),

            0 0 20px
            rgba(255, 75, 43, 0.15);
        }


        /* ======================================
           FEATURED CARD
        ====================================== */

        .card.featured {
          background:
            linear-gradient(
              180deg,
              rgba(30, 20, 28, 0.9) 0%,
              rgba(16, 19, 28, 0.9) 100%
            );

          border:
            1px solid
            rgba(255, 75, 43, 0.5);

          box-shadow:
            0 16px 40px
            rgba(255, 75, 43, 0.2);
        }


        .card.featured:hover {
          border-color:
            rgba(255, 75, 43, 0.7);

          box-shadow:
            0 20px 45px
            rgba(255, 75, 43, 0.25);
        }


        /* ======================================
           BADGE - POPULAR
        ====================================== */

        .pricing-badge-popular {
          position: absolute;

          top: -13px;

          left: 50%;

          transform:
            translateX(-50%);

          background:
            linear-gradient(
              135deg,
              #ff416c,
              #ff4b2b
            );

          color:
            #ffffff;

          font-size:
            11px;

          font-weight:
            800;

          letter-spacing:
            0.8px;

          padding:
            4px 14px;

          border-radius:
            20px;

          text-transform:
            uppercase;

          white-space:
            nowrap;

          z-index:
            5;
        }


        /* ======================================
           BADGE - SAVE
        ====================================== */

        .pricing-badge-save {
          position: absolute;

          top: -13px;

          left: 50%;

          transform:
            translateX(-50%);

          background:
            linear-gradient(
              135deg,
              #ffe600,
              #ff8c00
            );

          color:
            #000000;

          font-size:
            11px;

          font-weight:
            800;

          letter-spacing:
            0.8px;

          padding:
            4px 14px;

          border-radius:
            20px;

          text-transform:
            uppercase;

          white-space:
            nowrap;

          z-index:
            5;
        }


        /* ======================================
           PRICE
        ====================================== */

        .price-wrap {
          display:
            flex;

          align-items:
            baseline;

          gap:
            6px;

          margin-bottom:
            0.6rem;
        }


        .price {
          /*
            2.8rem → 3.2rem
          */

          font-size:
            3.2rem;

          line-height:
            1;

          font-weight:
            800;

          letter-spacing:
            -0.025em;

          color:
            rgba(255, 255, 255, 1);
        }


        .price-wrap span {
          /*
            Bigger by roughly 4px
          */

          font-size:
            1rem;

          font-weight:
            500;

          color:
            rgba(255, 255, 255, 0.6);
        }


        /* ======================================
           PLAN TITLE
        ====================================== */

        .plan-title {
          /*
            1.25rem → 1.4rem
          */

          font-size:
            1.4rem;

          font-weight:
            700;

          color:
            #ffffff;

          margin-bottom:
            0.3rem;
        }


        /* ======================================
           PLAN DESCRIPTION
        ====================================== */

        .plan-desc {
          /*
            0.8rem → 0.9rem
          */

          font-size:
            0.9rem;

          color:
            #94a3b8;

          margin-bottom:
            1.6rem;

          line-height:
            1.5;
        }


        /* ======================================
           FEATURES
        ====================================== */

        .lists {
          margin-top:
            1.6rem;

          display:
            flex;

          flex-direction:
            column;

          row-gap:
            0.85rem;

          font-size:
            0.975rem;

          line-height:
            1.35rem;

          color:
            rgba(255, 255, 255, 1);

          padding:
            0;

          margin-left:
            0;

          margin-right:
            0;

          list-style:
            none;
        }


        .list {
          display:
            flex;

          align-items:
            center;

          min-width:
            0;
        }


        .list svg {
          height:
            1.25rem;

          width:
            1.25rem;

          flex-shrink:
            0;
        }


        .list span {
          margin-left:
            0.75rem;

          color:
            #cbd5e1;

          /*
            13px → 17px
            EXACT +4px
          */

          font-size:
            17px;

          line-height:
            1.4;

          min-width:
            0;
        }


        /* ======================================
           BUTTON
        ====================================== */

        .action {
          margin-top:
            2rem;

          width:
            100%;

          border:
            2px solid
            #fff;

          border-radius:
            9999px;

          background-color:
            #fff;

          padding:
            0.75rem 1.5rem;

          text-align:
            center;

          /*
            0.875rem → 1rem
          */

          font-size:
            1rem;

          font-weight:
            700;

          line-height:
            1.35rem;

          color:
            #000;

          outline:
            none;

          transition:
            all 0.2s ease;

          cursor:
            pointer;

          display:
            block;

          text-decoration:
            none;

          box-sizing:
            border-box;
        }


        .action:hover {
          color:
            rgba(255, 255, 255, 1);

          background-color:
            transparent;

          border-color:
            #ff5232;
        }


        /* ======================================
           FEATURED BUTTON
        ====================================== */

        .action.featured-btn {
          background-color:
            #ff5232;

          border-color:
            #ff5232;

          color:
            #ffffff;
        }


        .action.featured-btn:hover {
          background-color:
            transparent;

          border-color:
            #ffffff;
        }


        /* ======================================
           TABLET
        ====================================== */

        @media (max-width: 1080px) {

          .pricing-grid-updated {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap:
              20px;
          }

          .card {
            padding:
              2rem 1.5rem;
          }

        }


        /* ======================================
           MOBILE
        ====================================== */

        @media (max-width: 640px) {

          .pricing-grid-updated {
            grid-template-columns:
              1fr;

            gap:
              18px;

            margin-top:
              30px;
          }


          .card {
            width:
              100%;

            /*
              Increased height automatically
              according to bigger content
            */

            padding:
              2rem 1.4rem;

            border-radius:
              1.4rem;

            height:
              auto;
          }


          .card:hover {
            transform:
              translateY(-3px);
          }


          .price {
            /*
              Mobile price also increased
            */

            font-size:
              2.9rem;
          }


          .price-wrap span {
            font-size:
              0.95rem;
          }


          .plan-title {
            font-size:
              1.4rem;
          }


          .plan-desc {
            font-size:
              0.9rem;

            line-height:
              1.5;
          }


          .lists {
            row-gap:
              0.8rem;

            margin-top:
              1.5rem;
          }


          .list svg {
            height:
              1.15rem;

            width:
              1.15rem;
          }


          .list span {
            /*
              13px → 17px
            */

            font-size:
              17px;

            line-height:
              1.4;
          }


          .action {
            margin-top:
              1.8rem;

            padding:
              0.75rem 1.5rem;

            font-size:
              1rem;
          }


          .pricing-badge-popular,
          .pricing-badge-save {
            font-size:
              10px;

            padding:
              4px 12px;
          }

        }


        /* ======================================
           SMALL MOBILE
        ====================================== */

        @media (max-width: 380px) {

          .pricing-grid-updated {
            gap:
              16px;
          }


          .card {
            padding:
              1.8rem 1.25rem;
          }


          .price {
            font-size:
              2.7rem;
          }


          .plan-title {
            font-size:
              1.35rem;
          }


          .plan-desc {
            font-size:
              0.88rem;
          }


          .list span {
            /*
              Still 4px bigger than old 12.5px
            */

            font-size:
              16.5px;
          }


          .action {
            font-size:
              0.98rem;
          }

        }

      `}</style>


      {/* ======================================
          PRICING SECTION
      ====================================== */}

      <section
        className="section"
        id="pricing"
        style={{
          background:
            "#080a0e",

          padding:
            "90px 20px 70px",
        }}
      >

        <div
          className="container"
          style={{
            maxWidth:
              "1240px",

            margin:
              "0 auto",

            width:
              "100%",
          }}
        >

          {/* ==================================
              HEADER
          ================================== */}

          <div
            className="section-header fade-in"
            style={{
              textAlign:
                "center",

              marginBottom:
                "40px",
            }}
          >

            <span
              style={{
                display:
                  "inline-block",

                fontSize:
                  "13px",

                fontWeight:
                  900,

                letterSpacing:
                  "2px",

                textTransform:
                  "uppercase",

                color:
                  "#ff5232",

                background:
                  "rgba(255, 82, 50, 0.1)",

                padding:
                  "6px 16px",

                borderRadius:
                  "20px",

                border:
                  "1px solid rgba(255, 82, 50, 0.3)",

                marginBottom:
                  "12px",
              }}
            >
              PRICING PLANS
            </span>


            <h2
              style={{
                fontSize:
                  "clamp(2.2rem, 4vw, 3.2rem)",

                color:
                  "#fff",

                fontWeight:
                  900,

                marginTop:
                  "4px",

                marginBottom:
                  "0",

                lineHeight:
                  "1.1",

                letterSpacing:
                  "-0.03em",
              }}
            >
              Start free. Upgrade as you transform.
            </h2>


            <p
              style={{
                color:
                  "#94a3b8",

                maxWidth:
                  "600px",

                margin:
                  "12px auto 0",

                fontSize:
                  "15px",

                lineHeight:
                  "1.6",
              }}
            >
              Simple plans built for your
              fitness journey. Start free
              and upgrade when you're ready.
            </p>

          </div>


          {/* ==================================
              PRICING CARDS
          ================================== */}

          <div
            className="pricing-grid-updated"
          >

            {/* ==================================
                FREE PLAN
            ================================== */}

            <div
              className="card fade-in"
            >

              <div>

                <div className="price-wrap">

                  <div className="price">
                    $0
                  </div>

                  <span>
                    / lifetime
                  </span>

                </div>


                <div className="plan-title">
                  Free
                </div>


                <div className="plan-desc">
                  Get started with essentials
                </div>


                <ul className="lists">

                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ⚠️ Contains Ads
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.9726 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      1 Food Scan / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      1 Body Scan / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      5 AI Chat Msgs / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      Full body Transformation
                    </span>

                  </li>

                </ul>

              </div>


              <button
                onClick={() =>
                  handlePayment(
                    "Free",
                    0
                  )
                }
                className="action"
              >
                Get started
              </button>

            </div>


            {/* ==================================
                WEEKLY PLAN
            ================================== */}

            <div
              className="card fade-in"
            >

              <div>

                <div className="price-wrap">

                  <div className="price">
                    $4.99
                  </div>

                  <span>
                    / week
                  </span>

                </div>


                <div className="plan-title">
                  Weekly
                </div>


                <div className="plan-desc">
                  Flexible trial sprint
                </div>


                <ul className="lists">

                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ✨ 100% Ad-Free
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      3 Body Scans / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      5 Food Scans / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      20 AI Chat Msgs / day
                    </span>

                  </li>

                     <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                     Workout Unlocked
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      Personal Coach Access
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#22c55e"
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      />
                    </svg>

                    <span
                      style={{
                        color:
                          "#22c55e",

                        fontWeight:
                          "600",
                      }}
                    >
                      🔓 Analytics Unlocked
                    </span>

                  </li>

                </ul>

              </div>


              <button
                onClick={() =>
                  handlePayment(
                    "Weekly",
                    0.001
                  )
                }
                className="action"
              >
                Get started
              </button>

            </div>


            {/* ==================================
                MONTHLY PLAN
            ================================== */}

            <div
              className="card featured fade-in"
            >

              <span
                className="pricing-badge-popular"
              >
                MOST POPULAR
              </span>


              <div>

                <div className="price-wrap">

                  <div
                    className="price"
                    style={{
                      color:
                        "#ff5232",
                    }}
                  >
                    $12.99
                  </div>

                  <span>
                    / month
                  </span>

                </div>


                <div className="plan-title">
                  Monthly
                </div>


                <div className="plan-desc">
                  Full 30-day Transformation power
                </div>


                <ul className="lists">

                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ✨ 100% Ad-Free
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      5 Body Scans / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      10 Food Scans / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      30 AI Chat Msgs / day
                    </span>

                  </li>

                     <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      Workout Unlocked
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ⚡ Personal Coach Access - Pro
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#22c55e"
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      />
                    </svg>

                    <span
                      style={{
                        color:
                          "#22c55e",

                        fontWeight:
                          "600",
                      }}
                    >
                      🔓 Pro Analytics Unlocked
                    </span>

                  </li>

                </ul>

              </div>


              <button
                onClick={() =>
                  handlePayment(
                    "Monthly",
                    0.001
                  )
                }
                className="action featured-btn"
              >
                Get started
              </button>

            </div>


            {/* ==================================
                YEARLY PLAN
            ================================== */}

            <div
              className="card fade-in"
            >

              <span
                className="pricing-badge-save"
              >
                SAVE 36%
              </span>


              <div>

                <div className="price-wrap">

                  <div className="price">
                    $99
                  </div>

                  <span>
                    / year
                  </span>

                </div>


                <div className="plan-title">
                  Yearly
                </div>


                <div className="plan-desc">
                  Complete long-term journey
                </div>


                <ul className="lists">

                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ⚡ 100% Ad-Free
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      10 Body Scans / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      50 Food Scans / day
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      100 AI Chat Msgs / day
                    </span>

                  </li>

                  
                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ⚡ Personal Coach Access - Pro
                    </span>

                  </li>
                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ff5232"
                        d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>

                    <span>
                      ⚡ Workout Unlocked
                    </span>

                  </li>


                  <li className="list">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#22c55e"
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      />
                    </svg>

                    <span
                      style={{
                        color:
                          "#22c55e",

                        fontWeight:
                          "600",
                      }}
                    >
                      🔓 Pro Analytics Unlocked
                    </span>

                  </li>

                </ul>

              </div>


              <button
                onClick={() =>
                  handlePayment(
                    "Yearly",
                    0.0001
                  )
                }
                className="action"
              >
                Get started
              </button>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}