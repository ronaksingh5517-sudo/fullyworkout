export const metadata = {
  title: "Privacy Policy | FullyWorkout",
  description: "Privacy Policy for FullyWorkout.",
};

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    text: `Depending on how you use FullyWorkout, we may collect account information, such as your name and email address, as well as information you provide while using fitness features.`,
  },
  {
    number: "02",
    title: "Fitness and Usage Information",
    text: `Information provided while using workout, nutrition, body analysis, progress, or AI features may be processed to provide and improve the requested functionality.`,
  },
  {
    number: "03",
    title: "Payment Information",
    text: `Payments for paid subscriptions are processed by our payment provider. FullyWorkout does not need to store your complete payment card details to provide subscription services.`,
  },
  {
    number: "04",
    title: "How We Use Information",
    text: `Information may be used to provide services, manage accounts, process subscriptions, personalize fitness experiences, improve the platform, prevent abuse, and communicate important service information.`,
  },
  {
    number: "05",
    title: "Cookies and Local Storage",
    text: `FullyWorkout may use cookies, local storage, or similar technologies to maintain sessions, remember preferences, and provide platform functionality.`,
  },
  {
    number: "06",
    title: "Data Security",
    text: `We take reasonable measures to protect information from unauthorized access, alteration, disclosure, or destruction. However, no internet-based service can guarantee absolute security.`,
  },
  {
    number: "07",
    title: "Third-Party Services",
    text: `FullyWorkout may use trusted third-party services for authentication, payments, hosting, analytics, AI processing, and other platform functions. These services may process information according to their own privacy policies.`,
  },
  {
    number: "08",
    title: "Your Choices",
    text: `You may contact us regarding questions about your personal information or account. Where applicable, you may request access, correction, or deletion of your information.`,
  },
  {
    number: "09",
    title: "Changes to This Policy",
    text: `This Privacy Policy may be updated periodically. Any changes will be published on this page.`,
  },
  {
    number: "10",
    title: "Contact",
    text: `For privacy-related questions, please contact FullyWorkout through the contact/support options available on the website.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        .privacy-page {
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

        .privacy-container {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .privacy-header {
          text-align: center;
          margin-bottom: 45px;
        }

        .privacy-badge {
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

        .privacy-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff8a00;
          box-shadow: 0 0 12px rgba(255, 138, 0, 0.8);
        }

        .privacy-title {
          margin: 22px 0 12px;
          font-size: clamp(38px, 6vw, 62px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.045em;
        }

        .privacy-gradient {
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

        .privacy-description {
          max-width: 620px;
          margin: 0 auto;
          color: #888;
          font-size: 15px;
          line-height: 1.7;
        }

        .privacy-date {
          margin-top: 18px;
          color: #555;
          font-size: 12px;
        }

        .privacy-line {
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

        .privacy-card {
          position: relative;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.025);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.025);
        }

        .privacy-section {
          display: flex;
          gap: 22px;
          padding: 28px 30px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.018);
          transition: 0.25s ease;
        }

        .privacy-section + .privacy-section {
          margin-top: 8px;
        }

        .privacy-section:hover {
          border-color: rgba(255, 135, 0, 0.18);
          background: rgba(255, 255, 255, 0.035);
          transform: translateY(-1px);
        }

        .privacy-number {
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

        .privacy-section-title {
          margin: 2px 0 9px;
          color: #fff;
          font-size: 19px;
          line-height: 1.3;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .privacy-text {
          margin: 0;
          color: #999;
          font-size: 14px;
          line-height: 1.8;
        }

        .privacy-bottom {
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

        .privacy-footer {
          margin-top: 35px;
          text-align: center;
          color: #444;
          font-size: 11px;
        }

        @media (max-width: 640px) {
          .privacy-page {
            padding: 45px 14px 55px;
          }

          .privacy-header {
            margin-bottom: 30px;
          }

          .privacy-title {
            font-size: 40px;
          }

          .privacy-description {
            font-size: 13px;
          }

          .privacy-card {
            padding: 6px;
            border-radius: 22px;
          }

          .privacy-section {
            gap: 14px;
            padding: 20px 16px;
            border-radius: 16px;
          }

          .privacy-number {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            border-radius: 11px;
            font-size: 10px;
          }

          .privacy-section-title {
            font-size: 17px;
          }

          .privacy-text {
            font-size: 13px;
            line-height: 1.7;
          }
        }
      `}</style>

      <main className="privacy-page">
        <div className="privacy-container">

          {/* Header */}
          <header className="privacy-header">
            <div className="privacy-badge">
              <span className="privacy-dot" />
              FullyWorkout Legal
            </div>

            <h1 className="privacy-title">
              Privacy <span className="privacy-gradient">Policy</span>
            </h1>

            <p className="privacy-description">
              Learn how FullyWorkout collects, uses, protects, and processes
              information while you use our fitness platform.
            </p>

            <p className="privacy-date">
              Last updated: October 7, 2026
            </p>

            <div className="privacy-line" />
          </header>

          {/* Privacy Sections */}
          <div className="privacy-card">
            {sections.map((section) => (
              <section
                className="privacy-section"
                key={section.number}
              >
                <div className="privacy-number">
                  {section.number}
                </div>

                <div>
                  <h2 className="privacy-section-title">
                    {section.title}
                  </h2>

                  <p className="privacy-text">
                    {section.text}
                  </p>
                </div>
              </section>
            ))}
          </div>

          {/* Bottom Notice */}
          <div className="privacy-bottom">
            Your privacy matters to us. We aim to handle your information
            responsibly and transparently while providing FullyWorkout's
            services.
          </div>

          {/* Footer */}
          <div className="privacy-footer">
            © {new Date().getFullYear()} FullyWorkout. All rights reserved.
          </div>

        </div>
      </main>
    </>
  );
}