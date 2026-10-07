export const metadata = {
  title: "Terms of Service | FullyWorkout",
  description: "Terms of Service for FullyWorkout.",
};

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    text: `By accessing or using FullyWorkout, you agree to these Terms of Service. If you do not agree with these terms, please do not use the service.`,
  },
  {
    number: "02",
    title: "About FullyWorkout",
    text: `FullyWorkout is an AI-powered fitness platform that provides digital fitness tools and services, including personalized workouts, fitness coaching, food and nutrition scanning, body analysis, progress tracking, and fitness transformation features.`,
  },
  {
    number: "03",
    title: "User Accounts",
    text: `You are responsible for maintaining the security of your account and for all activity that occurs through your account. You agree to provide accurate information when creating or using an account.`,
  },
  {
    number: "04",
    title: "Subscriptions and Payments",
    text: `Certain features of FullyWorkout may require a paid subscription. Subscription prices, billing frequency, and available features are displayed before purchase.`,
    extra: `Paid subscriptions may automatically renew according to the selected billing period unless cancelled before the next renewal.`,
  },
  {
    number: "05",
    title: "Fitness Disclaimer",
    text: `FullyWorkout provides fitness and wellness information for informational purposes only. The platform is not a substitute for professional medical advice, diagnosis, or treatment.`,
    extra: `Consult a qualified healthcare professional before starting a new exercise or nutrition program, especially if you have any medical concerns.`,
  },
  {
    number: "06",
    title: "Acceptable Use",
    text: `You must not misuse the service, attempt to gain unauthorized access, interfere with the platform, or use FullyWorkout for unlawful purposes.`,
  },
  {
    number: "07",
    title: "Intellectual Property",
    text: `The FullyWorkout platform, branding, software, design, and original content are protected by applicable intellectual property laws.`,
  },
  {
    number: "08",
    title: "Changes to These Terms",
    text: `We may update these Terms of Service from time to time. Updated terms will be published on this page.`,
  },
  {
    number: "09",
    title: "Contact",
    text: `If you have questions about these Terms of Service, please contact FullyWorkout through the contact or support options available on the website.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <style>{`
        .terms-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% -10%, rgba(255, 125, 0, 0.13), transparent 35%),
            radial-gradient(circle at 90% 40%, rgba(255, 80, 0, 0.06), transparent 25%),
            #050505;
          color: #fff;
          padding: 70px 20px 80px;
        }

        .terms-container {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
        }

        .terms-header {
          text-align: center;
          margin-bottom: 45px;
        }

        .terms-badge {
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

        .terms-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff8a00;
          box-shadow: 0 0 12px rgba(255, 138, 0, 0.8);
        }

        .terms-title {
          margin: 22px 0 12px;
          font-size: clamp(38px, 6vw, 62px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.045em;
        }

        .terms-gradient {
          background: linear-gradient(90deg, #ff8a00, #ffb13b, #ff7300);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .terms-description {
          max-width: 600px;
          margin: 0 auto;
          color: #888;
          font-size: 15px;
          line-height: 1.7;
        }

        .terms-date {
          margin-top: 18px;
          color: #555;
          font-size: 12px;
        }

        .terms-line {
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

        .terms-card {
          position: relative;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.025);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.45),
            inset 0 1px rgba(255, 255, 255, 0.025);
        }

        .terms-section {
          display: flex;
          gap: 22px;
          padding: 28px 30px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.018);
          transition: 0.25s ease;
        }

        .terms-section + .terms-section {
          margin-top: 8px;
        }

        .terms-section:hover {
          border-color: rgba(255, 135, 0, 0.18);
          background: rgba(255, 255, 255, 0.035);
          transform: translateY(-1px);
        }

        .terms-number {
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

        .terms-section-title {
          margin: 2px 0 9px;
          color: #fff;
          font-size: 19px;
          line-height: 1.3;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .terms-text {
          margin: 0;
          color: #999;
          font-size: 14px;
          line-height: 1.8;
        }

        .terms-extra {
          margin-top: 12px;
          color: #777;
          font-size: 14px;
          line-height: 1.8;
        }

        .terms-bottom {
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

        .terms-footer {
          margin-top: 35px;
          text-align: center;
          color: #444;
          font-size: 11px;
        }

        @media (max-width: 640px) {
          .terms-page {
            padding: 45px 14px 55px;
          }

          .terms-header {
            margin-bottom: 30px;
          }

          .terms-title {
            font-size: 40px;
          }

          .terms-description {
            font-size: 13px;
          }

          .terms-card {
            padding: 6px;
            border-radius: 22px;
          }

          .terms-section {
            gap: 14px;
            padding: 20px 16px;
            border-radius: 16px;
          }

          .terms-number {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            border-radius: 11px;
            font-size: 10px;
          }

          .terms-section-title {
            font-size: 17px;
          }

          .terms-text,
          .terms-extra {
            font-size: 13px;
            line-height: 1.7;
          }
        }
      `}</style>

      <main className="terms-page">
        <div className="terms-container">

          <header className="terms-header">
            <div className="terms-badge">
              <span className="terms-dot" />
              FullyWorkout Legal
            </div>

            <h1 className="terms-title">
              Terms of <span className="terms-gradient">Service</span>
            </h1>

            <p className="terms-description">
              Please read these terms carefully before using the FullyWorkout
              platform and its fitness services.
            </p>

            <p className="terms-date">
              Last updated: October 7, 2026
            </p>

            <div className="terms-line" />
          </header>

          <div className="terms-card">
            {sections.map((section) => (
              <section className="terms-section" key={section.number}>
                <div className="terms-number">
                  {section.number}
                </div>

                <div>
                  <h2 className="terms-section-title">
                    {section.title}
                  </h2>

                  <p className="terms-text">
                    {section.text}
                  </p>

                  {section.extra && (
                    <p className="terms-extra">
                      {section.extra}
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="terms-bottom">
            By continuing to use FullyWorkout, you acknowledge that you have
            read and agree to these Terms of Service.
          </div>

          <div className="terms-footer">
            © {new Date().getFullYear()} FullyWorkout. All rights reserved.
          </div>

        </div>
      </main>
    </>
  );
}