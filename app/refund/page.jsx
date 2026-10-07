export const metadata = {
  title: "Refund Policy | FullyWorkout",
  description: "Refund Policy for FullyWorkout.",
};

const sections = [
  {
    number: "01",
    title: "Subscription Payments",
    text: `FullyWorkout provides digital fitness services through subscription plans. Subscription charges are made according to the plan selected at checkout.`,
  },
  {
    number: "02",
    title: "Cancellation",
    text: `You may cancel your subscription before the next renewal to prevent future recurring charges. Cancellation does not automatically create a refund for a payment that has already been processed.`,
  },
  {
    number: "03",
    title: "Refund Requests",
    text: `Refund requests may be reviewed on a case-by-case basis, including situations involving accidental duplicate charges, technical issues that prevent access to a purchased service, or other circumstances where a refund is considered appropriate.`,
  },
  {
    number: "04",
    title: "Non-Refundable Situations",
    text: `Refunds may not be provided for unused time, failure to cancel before renewal, or dissatisfaction with results where the service was successfully provided.`,
  },
  {
    number: "05",
    title: "Processing",
    text: `Approved refunds are processed through the payment method used for the original transaction. The time required for the refund to appear may depend on the payment provider or financial institution.`,
  },
  {
    number: "06",
    title: "Contact",
    text: `To request a refund or report a billing issue, please contact FullyWorkout through the contact/support options available on the website.`,
  },
];

export default function RefundPage() {
  return (
    <>
      <style>{`
        .refund-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(255, 125, 0, 0.13),
              transparent 35%
            ),
            radial-gradient(
              circle at 90% 40%,
              rgba(255, 80, 0, 0.06),
              transparent 25%
            ),
            #050505;
          color: #fff;
          padding: 70px 20px 80px;
        }

        .refund-container {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .refund-header {
          text-align: center;
          margin-bottom: 45px;
        }

        .refund-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          border: 1px solid rgba(255, 140, 0, 0.22);
          border-radius: 999px;
          background: rgba(255, 110, 0, 0.08);
          color: #ff9d3d;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .refund-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff8a00;
          box-shadow: 0 0 12px rgba(255, 138, 0, 0.8);
        }

        .refund-title {
          margin: 22px 0 12px;
          font-size: clamp(38px, 6vw, 62px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.045em;
        }

        .refund-gradient {
          background: linear-gradient(
            90deg,
            #ff8a00,
            #ffb13b,
            #ff7300
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .refund-description {
          max-width: 600px;
          margin: 0 auto;
          color: #888;
          font-size: 15px;
          line-height: 1.7;
        }

        .refund-date {
          margin-top: 18px;
          color: #555;
          font-size: 12px;
        }

        .refund-line {
          width: 100%;
          height: 1px;
          margin: 25px 0 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 130, 0, 0.45),
            transparent
          );
        }

        .refund-card {
          position: relative;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.025);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.025);
        }

        .refund-section {
          display: flex;
          gap: 22px;
          padding: 28px 30px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.018);
          transition: 0.25s ease;
        }

        .refund-section + .refund-section {
          margin-top: 8px;
        }

        .refund-section:hover {
          border-color: rgba(255, 135, 0, 0.18);
          background: rgba(255, 255, 255, 0.035);
          transform: translateY(-1px);
        }

        .refund-number {
          flex: 0 0 45px;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          border: 1px solid rgba(255, 130, 0, 0.2);
          background: rgba(255, 110, 0, 0.08);
          color: #ff9b32;
          font-size: 12px;
          font-weight: 800;
        }

        .refund-section-title {
          margin: 2px 0 9px;
          color: #fff;
          font-size: 19px;
          line-height: 1.3;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .refund-text {
          margin: 0;
          color: #999;
          font-size: 14px;
          line-height: 1.8;
        }

        .refund-bottom {
          margin-top: 25px;
          padding: 20px 24px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.018);
          text-align: center;
          color: #666;
          font-size: 12px;
          line-height: 1.7;
        }

        .refund-footer {
          margin-top: 35px;
          text-align: center;
          color: #444;
          font-size: 11px;
        }

        @media (max-width: 640px) {
          .refund-page {
            padding: 45px 14px 55px;
          }

          .refund-header {
            margin-bottom: 30px;
          }

          .refund-title {
            font-size: 40px;
          }

          .refund-description {
            font-size: 13px;
          }

          .refund-card {
            padding: 6px;
            border-radius: 22px;
          }

          .refund-section {
            gap: 14px;
            padding: 20px 16px;
            border-radius: 16px;
          }

          .refund-number {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            border-radius: 11px;
            font-size: 10px;
          }

          .refund-section-title {
            font-size: 17px;
          }

          .refund-text {
            font-size: 13px;
            line-height: 1.7;
          }
        }
      `}</style>

      <main className="refund-page">
        <div className="refund-container">

          {/* Header */}
          <header className="refund-header">
            <div className="refund-badge">
              <span className="refund-dot" />
              FullyWorkout Legal
            </div>

            <h1 className="refund-title">
              Refund <span className="refund-gradient">Policy</span>
            </h1>

            <p className="refund-description">
              Please review our refund and cancellation policy before
              purchasing a FullyWorkout subscription.
            </p>

            <p className="refund-date">
              Last updated: October 7, 2026
            </p>

            <div className="refund-line" />
          </header>

          {/* Policy Sections */}
          <div className="refund-card">
            {sections.map((section) => (
              <section
                className="refund-section"
                key={section.number}
              >
                <div className="refund-number">
                  {section.number}
                </div>

                <div>
                  <h2 className="refund-section-title">
                    {section.title}
                  </h2>

                  <p className="refund-text">
                    {section.text}
                  </p>
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Notice */}
          <div className="refund-bottom">
            Refund eligibility is determined according to the circumstances
            described in this policy and the applicable terms of service.
          </div>

          {/* Footer */}
          <div className="refund-footer">
            © {new Date().getFullYear()} FullyWorkout. All rights reserved.
          </div>

        </div>
      </main>
    </>
  );
}