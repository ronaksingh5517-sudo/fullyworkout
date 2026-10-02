"use client";

import { useState } from "react";

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How does FullyWorkout's AI Food Scanner work?",
            answer: "Simply snap a photo of your meal using our Vision AI. It instantly detects the dishes, breaks down individual ingredients, and calculates exact calories, proteins, carbs, and fats to log them automatically into your daily nutrition plan."
        },
        {
            question: "Can I use FullyWorkout on both mobile and desktop?",
            answer: "Yes! FullyWorkout is fully responsive and optimized for all devices—smartphones, tablets, laptops, and PCs. You can seamlessly switch between tracking your workouts in the gym and analyzing your data on your computer."
        },
        {
            question: "How do the 30-day transformation programs work?",
            answer: "We offer customized protocols tailored to your goals, whether it's Gym Transformation, Fat Loss, or Weight Gain. Each day features interactive exercise timers, set tracking, large crystal-clear visual GIFs, and built-in rest controls."
        },
        {
            question: "Is there a free version available?",
            answer: "Yes, you can start completely for free! The Free tier includes a basic 30-day plan, daily food scans, workout logs, and community access so you can kickstart your fitness journey without any risk."
        },
        {
            question: "How do I cancel or change my subscription?",
            answer: "You can upgrade, downgrade, or cancel your subscription at any time with a single click right from your account settings. There are no hidden fees or complicated cancellation processes."
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

            <section className="faq-section" id="faq">
                <div className="faq-container">

                    <div className="faq-header fade-in">
                        <span className="faq-label">FAQ</span>
                        <h2 className="faq-title">Frequently Asked Questions</h2>
                        <p className="faq-subtitle">
                            Everything you need to know about FullyWorkout, AI tracking, workouts, and pricing plans.
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