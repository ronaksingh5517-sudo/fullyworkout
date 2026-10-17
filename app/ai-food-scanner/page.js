
import Link from "next/link";

export const metadata = {
  title: "AI Food Scanner for Calories & Nutrition | FullyWorkout",
  description:
    "Scan food photos with FullyWorkout AI Food Scanner to estimate calories, protein, carbohydrates and fats. Explore nutrition and make informed food choices.",
  alternates: {
    canonical: "https://fullyworkout.com/ai-food-scanner",
  },
  openGraph: {
    title: "AI Food Scanner for Calories & Nutrition | FullyWorkout",
    description:
      "Explore estimated calories and macronutrients from your meals with FullyWorkout AI Food Scanner.",
    url: "https://fullyworkout.com/ai-food-scanner",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const benefits = [
  {
    icon: "◉",
    title: "Calorie Estimates",
    text: "Explore estimated calories in your meals and better understand what you eat.",
  },
  {
    icon: "✳",
    title: "Nutrition Breakdown",
    text: "Review estimated protein, carbohydrates and fats when available.",
  },
  {
    icon: "↗",
    title: "Fitness-Focused Insights",
    text: "Use nutrition information as part of your everyday fitness routine.",
  },
];

const steps = [
  {
    number: "01",
    title: "Capture your meal",
    text: "Take a picture of your food or upload an existing meal photo.",
  },
  {
    number: "02",
    title: "Scan your food",
    text: "Submit your image using the FullyWorkout food scanner.",
  },
  {
    number: "03",
    title: "Explore nutrition",
    text: "Review the estimated nutritional information returned by the tool.",
  },
];

const faqs = [
  {
    question: "What is an AI food scanner?",
    answer:
      "An AI food scanner analyzes a food image to estimate nutritional information, such as calories and macronutrients, when supported.",
  },
  {
    question: "Can I scan food to estimate calories?",
    answer:
      "Yes. Open the FullyWorkout food scanner, capture a meal or upload a picture, and review the estimates returned by the tool.",
  },
  {
    question: "Can an AI food scanner estimate protein, carbs and fats?",
    answer:
      "The scanner may estimate protein, carbohydrates and fats depending on the meal and the information it can identify.",
  },
  {
    question: "Are AI food scanner results exact?",
    answer:
      "No. Image-based nutrition results are estimates. Portion size, ingredients, sauces and cooking methods can affect accuracy.",
  },
  {
    question: "How do I use the FullyWorkout food scanner?",
    answer:
      "Visit the food scanner, capture a meal photo or upload an image, then review the nutrition information returned by the tool.",
  },
];

export default function AIFoodScannerPage() {
  return (
    <>
      <style>{`
        .afs-page,
        .afs-page * {
          box-sizing: border-box;
        }

        .afs-page {
          --afs-green: #c7f36b;
          --afs-green-hover: #d8ff91;
          --afs-muted: #a1aaa3;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #080b09;
          color: #f7faf7;
          font-family: Arial, Helvetica, sans-serif;
        }

        .afs-page a {
          text-decoration: none;
        }

        .afs-container {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
        }

        .afs-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .afs-glow {
          position: absolute;
          z-index: -1;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(100px);
        }

        .afs-glow-one {
          top: -180px;
          left: 25%;
          width: 480px;
          height: 480px;
          background: #a3e63518;
        }

        .afs-glow-two {
          top: 250px;
          right: -120px;
          width: 350px;
          height: 350px;
          background: #10b98115;
        }

        .afs-hero-grid {
          display: grid;
          grid-template-columns: 1.04fr 0.96fr;
          align-items: center;
          gap: 56px;
          padding-top: 92px;
          padding-bottom: 100px;
        }

        .afs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border: 1px solid #c7f36b35;
          border-radius: 50px;
          background: #c7f36b0c;
          color: var(--afs-green);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .afs-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--afs-green);
          box-shadow: 0 0 12px #c7f36b;
        }

        .afs-title {
          margin: 28px 0 22px;
          font-size: clamp(44px, 5.4vw, 72px);
          font-weight: 850;
          line-height: 1.06;
          letter-spacing: -2.7px;
        }

        .afs-title span,
        .afs-cta-title span {
          display: block;
          color: var(--afs-green);
        }

        .afs-description {
          max-width: 530px;
          margin: 0;
          color: var(--afs-muted);
          font-size: 16px;
          line-height: 1.9;
        }

        .afs-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 31px;
        }

        .afs-primary,
        .afs-secondary {
          display: inline-flex;
          min-height: 52px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 15px 23px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 750;
          transition:
            transform 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .afs-primary {
          border: 1px solid transparent;
          background: var(--afs-green);
          color: #11170a !important;
          box-shadow: 0 8px 28px #c7f36b12;
        }

        .afs-primary:hover {
          transform: translateY(-3px);
          background: var(--afs-green-hover);
          box-shadow: 0 12px 35px #c7f36b22;
        }

        .afs-primary span {
          font-size: 19px;
        }

        .afs-secondary {
          border: 1px solid #ffffff20;
          background: #ffffff05;
          color: #fff !important;
        }

        .afs-secondary:hover {
          border-color: #ffffff55;
          background: #ffffff0c;
        }

        .afs-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 18px;
          margin-top: 26px;
          color: #adb6ae;
          font-size: 12px;
          line-height: 1.7;
        }

        .afs-preview {
          padding: 22px;
          border: 1px solid #ffffff17;
          border-radius: 26px;
          background: linear-gradient(145deg, #151b17, #0d120f);
          box-shadow: 0 28px 90px #00000045;
          animation: afs-appear 0.8s ease both;
        }

        .afs-preview-header,
        .afs-nutrition-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .afs-preview-header h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 750;
        }

        .afs-preview-header p {
          margin: 7px 0 0;
          color: #89938b;
          font-size: 12px;
        }

        .afs-badge {
          padding: 8px 11px;
          border: 1px solid #c7f36b35;
          border-radius: 30px;
          background: #c7f36b0c;
          color: var(--afs-green);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .afs-food-visual {
          position: relative;
          display: flex;
          min-height: 300px;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
          overflow: hidden;
          border: 1px solid #ffffff0d;
          border-radius: 18px;
          background: radial-gradient(
            ellipse at center,
            #2a3c2c,
            #172119 65%,
            #101511
          );
        }

        .afs-orbit {
          position: absolute;
          border: 1px solid #c7f36b20;
          border-radius: 50%;
          animation: afs-pulse 4s ease-in-out infinite;
        }

        .afs-orbit-one {
          width: 265px;
          height: 265px;
        }

        .afs-orbit-two {
          width: 215px;
          height: 215px;
          border-color: #c7f36b35;
          animation-delay: 0.7s;
        }

        .afs-plate {
          z-index: 1;
          display: flex;
          width: 180px;
          height: 180px;
          align-items: center;
          justify-content: center;
          border: 8px solid #d8d1c0;
          border-radius: 50%;
          background: #e9e0cc;
          box-shadow: 0 0 55px #c7f36b15;
        }

        .afs-food-grid {
          display: grid;
          width: 145px;
          height: 145px;
          grid-template-columns: repeat(3, 1fr);
          align-items: center;
          justify-items: center;
          border: 1px solid #c5bca8;
          border-radius: 50%;
          background: #ded5c0;
          font-size: 26px;
        }

        .afs-food-grid span {
          transition: transform 0.2s ease;
        }

        .afs-food-grid span:hover {
          transform: scale(1.2);
        }

        .afs-tag {
          position: absolute;
          z-index: 2;
          padding: 9px 12px;
          border: 1px solid #ffffff20;
          border-radius: 9px;
          background: #080b09d9;
          color: #fff;
          font-size: 11px;
          backdrop-filter: blur(10px);
        }

        .afs-tag-top {
          top: 14px;
          left: 13px;
          color: var(--afs-green);
        }

        .afs-tag-bottom {
          right: 13px;
          bottom: 14px;
        }

        .afs-nutrition {
          margin-top: 16px;
          padding: 15px;
          border: 1px solid #ffffff0d;
          border-radius: 15px;
          background: #ffffff04;
        }

        .afs-nutrition-heading {
          color: #b8c0b9;
          font-size: 12px;
        }

        .afs-nutrition-heading span:last-child {
          color: #7e887f;
          font-size: 10px;
        }

        .afs-nutrition-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
          margin-top: 14px;
        }

        .afs-nutrition-item {
          min-width: 0;
          padding: 12px 9px;
          border: 1px solid #ffffff0d;
          border-radius: 10px;
          background: #080b0966;
        }

        .afs-nutrition-item p {
          margin: 0 0 8px;
          color: #8e9990;
          font-size: 11px;
        }

        .afs-nutrition-item strong {
          color: var(--afs-green);
          font-size: 11px;
        }

        .afs-disclaimer {
          margin: 13px 0 0;
          color: #788178;
          text-align: center;
          font-size: 10px;
          line-height: 1.7;
        }

        .afs-benefits {
          border-top: 1px solid #ffffff0e;
          border-bottom: 1px solid #ffffff0e;
          background: #ffffff03;
        }

        .afs-section {
          padding-top: 84px;
          padding-bottom: 84px;
        }

        .afs-section-heading {
          max-width: 680px;
        }

        .afs-label {
          color: var(--afs-green);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .afs-section-title {
          margin: 16px 0;
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1.5px;
        }

        .afs-section-description {
          max-width: 640px;
          margin: 0;
          color: var(--afs-muted);
          font-size: 15px;
          line-height: 1.9;
        }

        .afs-benefit-grid,
        .afs-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 19px;
          margin-top: 36px;
        }

        .afs-benefit-card,
        .afs-step-card {
          padding: 27px;
          border: 1px solid #ffffff12;
          border-radius: 18px;
          background: linear-gradient(145deg, #151a16, #0d110e);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .afs-benefit-card:hover,
        .afs-step-card:hover {
          transform: translateY(-5px);
          border-color: #c7f36b55;
          background: linear-gradient(145deg, #19221a, #0d110e);
        }

        .afs-benefit-icon {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border: 1px solid #c7f36b30;
          border-radius: 13px;
          background: #c7f36b0d;
          color: var(--afs-green);
          font-size: 23px;
        }

        .afs-card-title {
          margin: 21px 0 10px;
          color: #fff;
          font-size: 19px;
          font-weight: 750;
        }

        .afs-card-text {
          margin: 0;
          color: var(--afs-muted);
          font-size: 14px;
          line-height: 1.85;
        }

        .afs-center-heading {
          max-width: 750px;
          margin: 0 auto;
          text-align: center;
        }

        .afs-center-heading .afs-section-description {
          margin: 0 auto;
        }

        .afs-step-card {
          background: linear-gradient(180deg, #ffffff08, #ffffff02);
        }

        .afs-step-number {
          color: #c7f36bb5;
          font-size: 42px;
          font-weight: 850;
          letter-spacing: -2px;
        }

        .afs-center-action {
          display: flex;
          justify-content: center;
          margin-top: 35px;
        }

        .afs-faq-section {
          border-top: 1px solid #ffffff0e;
          border-bottom: 1px solid #ffffff0e;
          background: #ffffff03;
        }

        .afs-faq-container {
          width: min(820px, calc(100% - 48px));
          margin: 0 auto;
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .afs-faq-list {
          display: grid;
          gap: 12px;
          margin-top: 30px;
        }

        .afs-faq-item {
          border: 1px solid #ffffff13;
          border-radius: 14px;
          background: #ffffff04;
          transition: border-color 0.2s ease;
        }

        .afs-faq-item[open] {
          border-color: #c7f36b40;
        }

        .afs-faq-item summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
          color: #f7faf7;
          cursor: pointer;
          list-style: none;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.6;
        }

        .afs-faq-item summary::-webkit-details-marker {
          display: none;
        }

        .afs-faq-plus {
          flex-shrink: 0;
          color: var(--afs-green);
          font-size: 23px;
          font-weight: 400;
          transition: transform 0.2s ease;
        }

        .afs-faq-item[open] .afs-faq-plus {
          transform: rotate(45deg);
        }

        .afs-faq-answer {
          margin: 0;
          padding: 0 20px 20px;
          color: var(--afs-muted);
          font-size: 14px;
          line-height: 1.85;
        }

        .afs-cta-section {
          padding: 75px 24px;
        }

        .afs-cta-card {
          position: relative;
          width: min(1000px, 100%);
          margin: 0 auto;
          padding: 65px 35px;
          overflow: hidden;
          border: 1px solid #c7f36b30;
          border-radius: 26px;
          background:
            radial-gradient(ellipse at top, #c7f36b13, transparent 55%),
            linear-gradient(140deg, #151c16, #0c100d);
          text-align: center;
        }

        .afs-cta-title {
          max-width: 720px;
          margin: 22px auto 15px;
          font-size: clamp(30px, 4.5vw, 48px);
          font-weight: 850;
          line-height: 1.2;
          letter-spacing: -1.5px;
        }

        .afs-cta-description {
          max-width: 600px;
          margin: 0 auto 27px;
          color: var(--afs-muted);
          font-size: 15px;
          line-height: 1.85;
        }

        .afs-cta-card .afs-primary {
          margin-top: 3px;
        }

        @keyframes afs-appear {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes afs-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @media (max-width: 900px) {
          .afs-hero-grid {
            grid-template-columns: 1fr;
            gap: 42px;
            padding-top: 72px;
            padding-bottom: 75px;
          }

          .afs-hero-content {
            max-width: 700px;
          }

          .afs-preview {
            width: min(100%, 570px);
            margin: 0 auto;
          }

          .afs-benefit-grid,
          .afs-steps-grid {
            gap: 14px;
          }

          .afs-benefit-card,
          .afs-step-card {
            padding: 22px;
          }
        }

        @media (max-width: 650px) {
          .afs-container,
          .afs-faq-container {
            width: calc(100% - 36px);
          }

          .afs-hero-grid {
            gap: 35px;
            padding-top: 55px;
            padding-bottom: 58px;
          }

          .afs-eyebrow {
            gap: 8px;
            padding: 9px 11px;
            font-size: 9px;
            letter-spacing: 1px;
          }

          .afs-title {
            margin-top: 24px;
            font-size: clamp(41px, 11.8vw, 56px);
            letter-spacing: -1.8px;
          }

          .afs-description {
            font-size: 14px;
            line-height: 1.85;
          }

          .afs-actions {
            flex-direction: column;
            gap: 11px;
          }

          .afs-actions a {
            width: 100%;
          }

          .afs-trust {
            gap: 9px 13px;
            font-size: 11px;
          }

          .afs-preview {
            padding: 14px;
            border-radius: 20px;
          }

          .afs-food-visual {
            min-height: 250px;
          }

          .afs-plate {
            width: 155px;
            height: 155px;
          }

          .afs-food-grid {
            width: 125px;
            height: 125px;
            font-size: 22px;
          }

          .afs-orbit-one {
            width: 220px;
            height: 220px;
          }

          .afs-orbit-two {
            width: 185px;
            height: 185px;
          }

          .afs-tag {
            padding: 8px 9px;
            font-size: 10px;
          }

          .afs-nutrition {
            padding: 11px;
          }

          .afs-nutrition-grid {
            gap: 6px;
          }

          .afs-nutrition-item {
            padding: 10px 7px;
          }

          .afs-nutrition-item p {
            font-size: 10px;
          }

          .afs-nutrition-item strong {
            font-size: 10px;
          }

          .afs-section {
            padding-top: 58px;
            padding-bottom: 58px;
          }

          .afs-section-title {
            font-size: 32px;
            letter-spacing: -1px;
          }

          .afs-section-description {
            font-size: 14px;
          }

          .afs-benefit-grid,
          .afs-steps-grid {
            grid-template-columns: 1fr;
            gap: 13px;
            margin-top: 28px;
          }

          .afs-benefit-card,
          .afs-step-card {
            padding: 23px;
          }

          .afs-card-title {
            margin-top: 18px;
          }

          .afs-step-number {
            font-size: 36px;
          }

          .afs-faq-container {
            padding-top: 58px;
            padding-bottom: 58px;
          }

          .afs-faq-item summary {
            gap: 12px;
            padding: 17px;
            font-size: 13px;
          }

          .afs-faq-answer {
            padding: 0 17px 17px;
            font-size: 13px;
          }

          .afs-cta-section {
            padding: 45px 18px;
          }

          .afs-cta-card {
            padding: 45px 20px;
            border-radius: 20px;
          }

          .afs-cta-title {
            font-size: 31px;
            letter-spacing: -0.8px;
          }

          .afs-cta-description {
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .afs-page *,
          .afs-page *::before,
          .afs-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <main className="afs-page">
        <section className="afs-hero">
          <div className="afs-glow afs-glow-one" />
          <div className="afs-glow afs-glow-two" />

          <div className="afs-container afs-hero-grid">
            <div className="afs-hero-content">
              <span className="afs-eyebrow">
                <span className="afs-dot" />
                YOUR AI NUTRITION COMPANION
              </span>

              <h1 className="afs-title">
                Know what&apos;s
                <span>on your plate.</span>
              </h1>

              <p className="afs-description">
                Curious about the calories in your next meal? Use the
                FullyWorkout AI food scanner to explore estimated calories,
                protein, carbohydrates and fats from a food photo.
              </p>

              <div className="afs-actions">
                <Link href="/food-scanner" className="afs-primary">
                  Scan Your Food <span>→</span>
                </Link>

                <a href="#afs-how-it-works" className="afs-secondary">
                  How It Works
                </a>
              </div>

              <div className="afs-trust">
                <span>✓ Food photo analysis</span>
                <span>✓ Nutrition estimates</span>
                <span>✓ Fitness focused</span>
              </div>
            </div>

            <div className="afs-preview">
              <div className="afs-preview-header">
                <div>
                  <h2>Nutrition Preview</h2>
                  <p>Example meal breakdown</p>
                </div>
                <span className="afs-badge">AI SCAN</span>
              </div>

              <div className="afs-food-visual">
                <div className="afs-orbit afs-orbit-one" />
                <div className="afs-orbit afs-orbit-two" />

                <div className="afs-plate">
                  <div className="afs-food-grid">
                    <span>🥦</span>
                    <span>🥚</span>
                    <span>🥑</span>
                    <span>🍅</span>
                    <span>🍗</span>
                    <span>🥕</span>
                    <span>🥗</span>
                    <span>🍚</span>
                    <span>🫑</span>
                  </div>
                </div>

                <span className="afs-tag afs-tag-top">
                  Food preview
                </span>
                <span className="afs-tag afs-tag-bottom">
                  Nutrition estimate
                </span>
              </div>

              <div className="afs-nutrition">
                <div className="afs-nutrition-heading">
                  <span>Example nutrition</span>
                  <span>Illustrative only</span>
                </div>

                <div className="afs-nutrition-grid">
                  <div className="afs-nutrition-item">
                    <p>Calories</p>
                    <strong>Estimate</strong>
                  </div>
                  <div className="afs-nutrition-item">
                    <p>Protein</p>
                    <strong>Estimate</strong>
                  </div>
                  <div className="afs-nutrition-item">
                    <p>Carbs &amp; fats</p>
                    <strong>Estimate</strong>
                  </div>
                </div>
              </div>

              <p className="afs-disclaimer">
                Design preview only. This card does not perform a live scan.
              </p>
            </div>
          </div>
        </section>

        <section className="afs-benefits">
          <div className="afs-container afs-section">
            <div className="afs-section-heading">
              <span className="afs-label">NUTRITION MADE CLEARER</span>
              <h2 className="afs-section-title">
                Make every meal more meaningful.
              </h2>
              <p className="afs-section-description">
                Build awareness around what you eat and use nutrition
                estimates as one part of your fitness routine.
              </p>
            </div>

            <div className="afs-benefit-grid">
              {benefits.map((benefit) => (
                <article className="afs-benefit-card" key={benefit.title}>
                  <div className="afs-benefit-icon">{benefit.icon}</div>
                  <h3 className="afs-card-title">{benefit.title}</h3>
                  <p className="afs-card-text">{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="afs-how-it-works">
          <div className="afs-container afs-section">
            <div className="afs-center-heading">
              <span className="afs-label">THREE SIMPLE STEPS</span>
              <h2 className="afs-section-title">
                From food photo to insight.
              </h2>
              <p className="afs-section-description">
                Start with a picture, then review the nutrition estimates
                provided by the scanner.
              </p>
            </div>

            <div className="afs-steps-grid">
              {steps.map((step) => (
                <article className="afs-step-card" key={step.number}>
                  <span className="afs-step-number">{step.number}</span>
                  <h3 className="afs-card-title">{step.title}</h3>
                  <p className="afs-card-text">{step.text}</p>
                </article>
              ))}
            </div>

            <div className="afs-center-action">
              <Link href="/food-scanner" className="afs-primary">
                Try Food Scanner <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="afs-faq-section">
          <div className="afs-faq-container">
            <span className="afs-label">GOT QUESTIONS?</span>
            <h2 className="afs-section-title">
              AI Food Scanner FAQs
            </h2>

            <div className="afs-faq-list">
              {faqs.map((faq) => (
                <details className="afs-faq-item" key={faq.question}>
                  <summary>
                    {faq.question}
                    <span className="afs-faq-plus">+</span>
                  </summary>
                  <p className="afs-faq-answer">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="afs-cta-section">
          <div className="afs-cta-card">
            <span className="afs-label">
              START WITH YOUR NEXT MEAL
            </span>

            <h2 className="afs-cta-title">
              A little more awareness.
              <span>A smarter fitness routine.</span>
            </h2>

            <p className="afs-cta-description">
              Explore your meal&apos;s estimated nutrition with the
              FullyWorkout food scanner.
            </p>

            <Link href="/food-scanner" className="afs-primary">
              Scan Your Food Now <span>→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
