"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import all 6 flat data files from data folder
import { gymTransformationData } from "@/data/gym-transformation";
import { gymFatLossData } from "@/data/gym-fatloss";
import { gymGainWeightData } from "@/data/gym-gainweight";
import { homeTransformationData } from "@/data/home-transformation";
import { homeFatLossData } from "@/data/home-fatloss";
import { homeGainWeightData } from "@/data/home-gainweight";

export default function WorkoutView() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [workoutUnlocked, setWorkoutUnlocked] = useState(false);
  const [currentWorkoutData, setCurrentWorkoutData] = useState(null);

  // Helper function to map category and goal to the correct data file
  const getSelectedWorkoutData = (category, goal) => {
    if (category === "gym") {
      if (goal.includes("Transformation")) return gymTransformationData;
      if (goal.includes("Fat Loss")) return gymFatLossData;
      if (goal.includes("Gain Weight")) return gymGainWeightData;
    } else if (category === "home") {
      if (goal.includes("Transformation")) return homeTransformationData;
      if (goal.includes("Fat Loss")) return homeFatLossData;
      if (goal.includes("Gain Weight")) return homeGainWeightData;
    }
    return null;
  };

  // 🚀 AUTOMATIC CHECK: Agar pehle se goal saved hai, toh direct workout load karlo!
  useEffect(() => {
    const savedCategory = localStorage.getItem("aurafit_category");
    const savedGoal = localStorage.getItem("aurafit_goal");

    if (savedCategory && savedGoal) {
      setSelectedCategory(savedCategory);
      setSelectedGoal(savedGoal);
      const data = getSelectedWorkoutData(savedCategory, savedGoal);
      if (data) {
        setCurrentWorkoutData(data);
        setWorkoutUnlocked(true);
      }
    }
  }, []);

  const handleHomeWorkoutClick = () => {
    alert("This section is under construction! 🚧");
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    localStorage.setItem("aurafit_goal", goal);
    localStorage.setItem("aurafit_category", selectedCategory);
    
    // Slug generate karo goal ke hisaab se
    let slug = "gym-transformation";
    if (goal.includes("Fat Loss")) slug = "gym-fatloss";
    else if (goal.includes("Gain Weight")) slug = "gym-gainweight";

    // Direct uske sahi slug URL par redirect karo!
    router.push(`/workout/${slug}`);
  };

  // Reset function agar user ko apna goal change karna ho
  const handleResetGoal = () => {
    localStorage.removeItem("aurafit_goal");
    localStorage.removeItem("aurafit_category");
    setSelectedGoal(null);
    setWorkoutUnlocked(false);
    setSelectedCategory(null);
  };

  return (
    <div className="workout-page">
      {/* Galaxy Background */}
      <div className="galaxy"></div>

      {/* STEP 1: Parent Images (Home vs Gym) */}
      {!selectedCategory && !workoutUnlocked && (
        <div className="section-container">
          <h1 className="main-title">Select Your Workout</h1>
          <p className="subtitle">Choose where you want to perform your 30-day transformation.</p>
          
          <div className="cards-grid">
            <div className="image-card-wrapper under-construction" onClick={handleHomeWorkoutClick} style={{ cursor: "not-allowed", opacity: 0.75, position: "relative" }}>
              <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", fontSize: "11px", padding: "4px 8px", borderRadius: "6px", fontWeight: 800, border: "1px solid rgba(239, 68, 68, 0.4)", zIndex: 3 }}>Under Construction 🚧</span>
              <img src="/home.png" alt="Home Workout" className="interactive-3d-img" />
              <div className="img-title">🏠 Home Workout</div>
            </div>
            
            <div className="image-card-wrapper" onClick={() => setSelectedCategory("gym")}>
              <img src="/gym.png" alt="Gym Workout" className="interactive-3d-img" />
              <div className="img-title">🏢 Gym Workout</div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Children Images (3 Goals) */}
      {selectedCategory && !selectedGoal && !workoutUnlocked && (
        <div className="section-container">
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>← Back</button>
          <h1 className="main-title">Select Your 30-Day Goal ({selectedCategory.toUpperCase()}) 🔥</h1>
          <p className="subtitle">Pick your primary objective for the transformation engine.</p>

          <div className="cards-grid">
            {selectedCategory === "home" ? (
              <>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Home Transformation")}>
                  <img src="/home-transformation.png" alt="Transformation" className="interactive-3d-img" />
                  <div className="img-title">🔥 30 Days Transformation</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Home Fat Loss")}>
                  <img src="/home-fatloss.png" alt="Fat Loss" className="interactive-3d-img" />
                  <div className="img-title">⚡ Loss Fat</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Home Gain Weight")}>
                  <img src="/home-gainweight.png" alt="Gain Weight" className="interactive-3d-img" />
                  <div className="img-title">💪 Gain Weight</div>
                </div>
              </>
            ) : (
              <>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Gym Transformation")}>
                  <img src="/gym-transformation.png" alt="Transformation" className="interactive-3d-img" />
                  <div className="img-title">🔥 30 Days Transformation</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Gym Fat Loss")}>
                  <img src="/gym-fatloss.png" alt="Interactive 3D" className="interactive-3d-img" />
                  <div className="img-title">⚡ Loss Fat and Gain muscles</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Gym Gain Weight")}>
                  <img src="/gym-gainweight.png" alt="Gain Weight" className="interactive-3d-img" />
                  <div className="img-title">💪 Gain Weight with muscles</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Unlocked 30-Day Workout Progression Panel (Directly opens if saved) */}
      {workoutUnlocked && currentWorkoutData && (
        <div className="dashboard-panel">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <button className="back-btn" onClick={handleResetGoal}>🔄 Change Goal</button>
            <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: 700 }}>Saved Routine Active ✅</span>
          </div>

          <h1 className="main-title">🚀 {currentWorkoutData.title}</h1>
          <p className="subtitle">{currentWorkoutData.description}</p>

          <div className="workout-days-grid">
            <div className="day-card unlocked">
              <h3>Day 1 Routine</h3>
              <p>Status: Unlocked ✅</p>
              
              <div style={{ marginTop: "10px", textAlign: "left", fontSize: "13px", color: "#cbd5e1" }}>
                {currentWorkoutData?.exercises?.length > 0 ? (
                  currentWorkoutData.exercises.map((ex, idx) => (
                    <div key={idx} style={{ marginBottom: "6px" }}>
                      • <b>{ex.name}</b> ({ex.sets})
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#94a3b8" }}>No exercises found for this day.</p>
                )}
              </div>

              <button className="start-btn" onClick={() => router.push(`/workout/gym-transformation`)}>Start Exercise</button>
            </div>
            
            <div className="day-card locked">
              <h3>Day 2: Progression Split</h3>
              <p>Status: Locked 🔒 (Complete Day 1 first)</p>
            </div>
            <div className="day-card locked">
              <h3>Day 3: Endurance Core</h3>
              <p>Status: Locked 🔒</p>
            </div>
          </div>

          {/* Bottom Panel Features */}
          <div className="bottom-feature-bar">
            <button className="feature-btn" onClick={() => router.push("/food-scanner")}>🥗 Food Scanner</button>
            <button className="feature-btn ai-ask" onClick={() => router.push("/ai-coach")}>💬 Ask AI Coach</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .workout-page {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          background-color: #121214;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: system-ui, sans-serif;
          overflow-x: hidden;
          box-sizing: border-box;
          z-index: 1;
        }

        .section-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
          width: 100%;
          max-width: 1400px;
          z-index: 2;
        }

        .main-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .cards-grid {
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          width: 100%;
          perspective: 1000px;
        }

        .image-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .image-card-wrapper.under-construction:hover .interactive-3d-img {
          transform: none;
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.3);
        }

        .interactive-3d-img {
          width: 280px;  
          height: 360px; 
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(3, 192, 255, 0.4);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          transform-style: preserve-3d;
        }

        .image-card-wrapper:hover .interactive-3d-img {
          transform: rotateX(8deg) rotateY(-10deg) scale(1.04);
          box-shadow: -15px 30px 50px rgba(255, 75, 43, 0.4);
        }

        .img-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          transition: color 0.3s;
        }

        .image-card-wrapper:hover .img-title {
          color: #e81cff;
        }

        .galaxy {
          height: 100vh;
          width: 100vw;
          background-image: radial-gradient(#ffffff 1px, transparent 1px),
            radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: 0 0, 25px 25px;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 0;
          opacity: 0.3;
          pointer-events: none;
          animation: twinkle 5s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }

        .back-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          align-self: flex-start;
          margin-bottom: 10px;
          z-index: 2;
        }

        .dashboard-panel {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 2;
        }

        .workout-days-grid {
          display: flex;
          gap: 20px;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .day-card {
          background: #121622;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          width: 260px;
          text-align: left;
        }

        .day-card.locked {
          opacity: 0.5;
          border-style: dashed;
          text-align: center;
        }

        .start-btn {
          margin-top: 15px;
          width: 100%;
          background: #22c55e;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .bottom-feature-bar {
          position: fixed;
          bottom: 20px;
          display: flex;
          gap: 15px;
          background: rgba(18, 22, 32, 0.9);
          padding: 12px 24px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .feature-btn {
          background: #1e293b;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: 0.2s;
        }

        .feature-btn:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}