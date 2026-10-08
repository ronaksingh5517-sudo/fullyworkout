"use client";

import { useState } from "react";

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

 const faqs = [
    {
        question: "What is FullyWorkout and how does its AI fitness coach work?",
        answer:
            "FullyWorkout is an AI-powered fitness platform that brings personalized workouts, nutrition tracking, food scanning, body analysis, and fitness progress tracking together in one place. Its AI fitness coach uses your goals, fitness level, activity, and progress to provide personalized fitness guidance and help you stay consistent with your routine."
    },

    {
        question: "How does FullyWorkout create personalized workouts?",
        answer:
            "FullyWorkout can tailor workout recommendations around your fitness goals, experience level, available equipment, training preferences, and progress. Whether your goal is fat loss, muscle gain, or general fitness, the platform helps you follow a more structured workout routine instead of relying on a generic plan."
    },

    {
        question: "How does the AI Food Scanner work?",
        answer:
            "Take a photo of your meal and FullyWorkout uses AI-powered food recognition to identify foods and provide estimated calories and macronutrients such as protein, carbohydrates, and fats. You can use these estimates to help track your daily nutrition and stay aligned with your fitness goals."
    },

    {
        question: "Does FullyWorkout track body and fitness progress?",
        answer:
            "Yes. FullyWorkout includes body analysis and fitness progress tracking to help you review changes over time. You can track workout activity, nutrition progress, body and posture observations, and your overall transformation journey. Progress tracking can also help you stay consistent with your fitness goals."
    },

    {
        question: "Is FullyWorkout free and can I use it on mobile or desktop?",
        answer:
            "Yes. FullyWorkout offers a free option with selected fitness and tracking features, while paid plans can provide additional features and higher usage limits. FullyWorkout is designed to work across smartphones, tablets, laptops, and desktop computers. You can also manage your subscription from your account settings."
    }
];
  return (
    <>
      <style jsx>{`
        .faq-section {
          background-color: #080a0e;
          padding: 90px 20px 100px;
          position: relative;
          overflow: hidden;
        }
        .faq-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .faq-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .faq-label {
          display: inline-block;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #ff5232;
          background: rgba(255, 82, 50, 0.1);
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255, 82, 50, 0.3);
          margin-bottom: 12px;
        }
        .faq-title {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          color: #ffffff;
          font-weight: 900;
          margin-top: 4px;
        }
        .faq-subtitle {
          color: #94a3b8;
          max-width: 550px;
          margin: 12px auto 0;
          font-size: 15px;
          line-height: 1.6;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .faq-item {
          background: rgba(18, 22, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(12px);
        }
        .faq-item:hover {
          border-color: rgba(255, 75, 43, 0.35);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .faq-question {
          width: 100%;
          background: transparent;
          border: none;
          padding: 22px 24px;
          text-align: left;
          color: #ffffff;
          font-size: 17px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          outline: none;
        }
        .faq-question span {
          transition: transform 0.3s ease;
          color: #ff5232;
          font-size: 22px;
          font-weight: 900;
        }
        .faq-item.active .faq-question span {
          transform: rotate(45deg);
        }
        .faq-answer-wrap {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease-in-out, padding 0.35s ease;
          padding: 0 24px;
        }
        .faq-item.active .faq-answer-wrap {
          max-height: 200px;
          padding: 0 24px 24px 24px;
        }
        .faq-answer {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 16px;
        }
      `}</style>

     <section
    className="faq-section"
    id="faq"
    aria-label="Frequently Asked Questions About FullyWorkout AI Fitness"
>
        <div className="faq-container">

          <div className="faq-header fade-in">
            <span className="faq-label">FAQ</span>
            <h2 className="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="faq-subtitle">
              Find answers about FullyWorkout, AI fitness coaching, personalized
              workouts, food scanning, body analysis, nutrition tracking, and fitness
              progress.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;
              return (
                <div key={index} className={`faq-item ${isActive ? "active" : ""}`}>
                  <button onClick={() => toggleAccordion(index)} className="faq-question">
                    {faq.question}
                    <span>   ➢   </span>
                  </button>
                  <div className="faq-answer-wrap">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}