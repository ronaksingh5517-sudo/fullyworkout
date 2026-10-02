"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { gymTransformationData } from "@/data/gym-transformation";
import { gymFatLossData } from "@/data/gym-fatloss";
import { gymGainWeightData } from "@/data/gym-gainweight";

export default function WorkoutSlugPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params?.slug || "gym-transformation";

  let activeWorkoutData = gymTransformationData;
  if (slug.includes("fat-loss") || slug.includes("fatloss")) {
    activeWorkoutData = gymFatLossData;
  } else if (slug.includes("gain-weight") || slug.includes("gainweight")) {
    activeWorkoutData = gymGainWeightData;
  }

  const [completedDays, setCompletedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 Loading state add kar di
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [playerMode, setPlayerMode] = useState("exercise");
  const [timeLeft, setTimeLeft] = useState(40);
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [mealLogs, setMealLogs] = useState({});

  // 🚀 MongoDB se workout progress fetch
  useEffect(() => {
    if (!session?.user?.email) {
      setCompletedDays([]);
      setIsLoading(false);
      return;
    }

    const loadWorkoutProgress = async () => {
      try {
        const res = await fetch(
          `/api/progress?email=${encodeURIComponent(session.user.email)}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (res.ok && data?.success && Array.isArray(data.completedDays)) {
          setCompletedDays(
            data.completedDays.map(Number)
              .filter((day) => Number.isInteger(day) && day >= 1)
              .sort((a, b) => a - b)
          );
        } else {
          setCompletedDays([]);
        }
      } catch (err) {
        console.error("Failed to fetch workout progress from DB:", err);
        setCompletedDays([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkoutProgress();
  }, [session?.user?.email]);

  useEffect(() => {
    const savedLogs = localStorage.getItem("aurafit_meal_logs");
    if (savedLogs) {
      try { setMealLogs(JSON.parse(savedLogs)); } catch (e) { }
    }

    const lastScannedMeal = localStorage.getItem("aurafit_last_scanned_meal");
    const pendingDay = localStorage.getItem("aurafit_pending_log_day");
    const pendingMealType = localStorage.getItem("aurafit_pending_meal_type");

    if (lastScannedMeal && pendingDay && pendingMealType) {
      try {
        const mealData = JSON.parse(lastScannedMeal);
        const cals = mealData.totalCalories || 400;
        const prot = parseInt(mealData.totalProtein) || 30;
        const carb = parseInt(mealData.totalCarbs) || 45;

        setMealLogs((prevLogs) => {
          const updated = { ...prevLogs };
          if (!updated[pendingDay]) {
            updated[pendingDay] = {
              breakfast: { cals: 0, p: 0, c: 0 },
              lunch: { cals: 0, p: 0, c: 0 },
              dinner: { cals: 0, p: 0, c: 0 }
            };
          }

          updated[pendingDay][pendingMealType] = {
            cals: updated[pendingDay][pendingMealType].cals + cals,
            p: updated[pendingDay][pendingMealType].p + prot,
            c: updated[pendingDay][pendingMealType].c + carb
          };

          localStorage.setItem("aurafit_meal_logs", JSON.stringify(updated));
          return updated;
        });

        localStorage.removeItem("aurafit_last_scanned_meal");
        localStorage.removeItem("aurafit_pending_log_day");
        localStorage.removeItem("aurafit_pending_meal_type");
      } catch (err) {
        console.error("Failed to parse scanned meal", err);
      }
    }
  }, []);

  const handleTriggerFoodScan = (dayNum, mealType) => {
    localStorage.setItem("aurafit_pending_log_day", dayNum);
    localStorage.setItem("aurafit_pending_meal_type", mealType);
    router.push("/food-scanner");
  };

  const timerRef = useRef(null);
  const totalDays = activeWorkoutData.days?.length || 30;
  const progressPercentage = Math.round((completedDays.length / totalDays) * 100);

  const getTotalSets = (setsString) => {
    const match = setsString?.match(/\d+/);
    return match ? parseInt(match[0]) : 3;
  };

  const currentExercise = selectedDayData?.exercises[activeExerciseIndex];
  const totalSetsCount = currentExercise ? getTotalSets(currentExercise.sets) : 3;

  let totalSetsInDay = 0;
  let completedSetsInDay = 0;

  if (selectedDayData?.exercises) {
    selectedDayData.exercises.forEach((ex, idx) => {
      const sCount = getTotalSets(ex.sets);
      totalSetsInDay += sCount;
      if (idx < activeExerciseIndex) {
        completedSetsInDay += sCount;
      } else if (idx === activeExerciseIndex) {
        completedSetsInDay += Math.min(currentSet - 1, sCount);
      }
    });
  }

  const sessionProgressPercent = totalSetsInDay > 0 ? Math.min(Math.round((completedSetsInDay / totalSetsInDay) * 100), 100) : 0;

  useEffect(() => {
    if (!selectedDayData || !isStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const nextTime = prevTime - speed;

        if (nextTime > 0) {
          return nextTime;
        }

        if (playerMode === "exercise") {
          if (currentSet < totalSetsCount) {
            setCurrentSet((prevSet) => prevSet + 1);
            return 40;
          } else {
            if (activeExerciseIndex < selectedDayData.exercises.length - 1) {
              setPlayerMode("rest");
              return 40;
            } else {
              clearInterval(timerRef.current);
              handleCompleteWorkout(selectedDayData.day || 1);
              return 0;
            }
          }
        } else if (playerMode === "rest") {
          setActiveExerciseIndex((prevIdx) => prevIdx + 1);
          setCurrentSet(1);
          setPlayerMode("exercise");
          return 40;
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [selectedDayData, isStarted, playerMode, currentSet, activeExerciseIndex, speed, totalSetsCount]);

  const handleOpenModal = (item) => {
    setSelectedDayData(item);
    setActiveExerciseIndex(0);
    setCurrentSet(1);
    setPlayerMode("exercise");
    setTimeLeft(40);
    setIsStarted(false);
    setSpeed(1);
  };

  const handleCompleteWorkout = async (dayNum) => {
    const numericDay = Number(dayNum);

    // Day 1 is always the first available day.
    // Every other day can only be completed after the previous day.
    const isAllowedToComplete =
      numericDay === 1 || completedDays.includes(numericDay - 1);

    if (!isAllowedToComplete) {
      alert("🔒 Complete the previous day's workout first!");
      return;
    }

    const updatedDays = Array.from(
      new Set([...completedDays, numericDay])
    ).sort((a, b) => a - b);

    // Update UI immediately.
    setCompletedDays(updatedDays);

    if (session?.user?.email) {
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            completedDays: updatedDays,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "Failed to save workout progress");
        }

        if (Array.isArray(data.completedDays)) {
          setCompletedDays(
            data.completedDays.map(Number)
              .filter((day) => Number.isInteger(day) && day >= 1)
              .sort((a, b) => a - b)
          );
        }
      } catch (err) {
        console.error("Failed to sync workout progress to database:", err);
        setCompletedDays(completedDays);
        alert("⚠️ Progress save nahi ho paya. Please try again.");
        return;
      }
    }

    setSelectedDayData(null);
    setIsStarted(false);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handlePrevExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
      setCurrentSet(1);
      setPlayerMode("exercise");
      setTimeLeft(40);
      setIsStarted(false);
    }
  };

  const handleNextExercise = () => {
    if (selectedDayData && activeExerciseIndex < selectedDayData.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setCurrentSet(1);
      setPlayerMode("exercise");
      setTimeLeft(40);
      setIsStarted(false);
    }
  };

  const handleAddTenSeconds = () => {
    setTimeLeft((prev) => prev + 10);
  };

  const handleSkipRest = () => {
    if (activeExerciseIndex < selectedDayData.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setCurrentSet(1);
      setPlayerMode("exercise");
      setTimeLeft(40);
      setIsStarted(true);
    }
  };

  // 🚀 Jab tak database se data fetch ho raha hai, tab tak loading screen dikhao taaki glitch na ho
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#020617", color: "#38bdf8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "16px", fontWeight: "bold", fontFamily: "system-ui, sans-serif" }}>
        Loading your progress from Cloud... ⚡
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "20px 16px 120px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => router.back()} style={{ color: "#38bdf8", background: "rgba(56,189,248,0.08)", padding: "8px 14px", borderRadius: "12px", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: 700, fontSize: "12px" }}>
            <span>←</span> Back
          </button>
          <div style={{ background: "rgba(34,197,94,0.1)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(34,197,94,0.3)", fontSize: "11px", fontWeight: 800, color: "#4ade80", letterSpacing: "0.5px" }}>
            ⚡ AURA ENGINE v4.3 (PRO)
          </div>
        </div>

        {showSuccessCard && (
          <div className="card" style={{ marginBottom: "20px", width: "100%", maxWidth: "540px" }}>
            <svg className="wave" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z" fillopacity="1"></path>
            </svg>
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" strokeWidth="0" fill="currentColor" stroke="currentColor" className="icon">
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path>
              </svg>
            </div>
            <div className="message-text-container">
              <p className="message-text">Workout Completed!</p>
              <p className="sub-text">Great job keeping up with your goal.</p>
            </div>
            <svg onClick={() => setShowSuccessCard(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" strokeWidth="0" fill="none" stroke="currentColor" className="cross-icon">
              <path fill="currentColor" d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        )}

        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)", border: "1px solid rgba(56,189,248,0.25)", padding: "22px", borderRadius: "24px", marginBottom: "24px", boxShadow: "0 12px 35px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px" }}>Active Protocol</span>
              <h1 style={{ fontSize: "18px", color: "#fff", margin: "4px 0 2px 0", fontWeight: 900 }}>{activeWorkoutData.title}</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "20px", fontWeight: 900, color: "#4ade80" }}>{progressPercentage}%</span>
              <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 800, letterSpacing: "0.5px" }}>OVERALL</div>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 16px 0", lineHeight: "1.5" }}>{activeWorkoutData.description}</p>

          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercentage}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #22c55e)", borderRadius: "6px", transition: "width 0.4s ease" }}></div>
          </div>
        </div>

        <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📅</span> 30-Day Training Roadmap
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>
          {activeWorkoutData.days.map((item, index) => {
            const dayNum = item.day || index + 1;
            const isCompleted = completedDays.includes(dayNum);
            const isUnlocked = dayNum === 1 || completedDays.includes(dayNum - 1);
            const isToday = isUnlocked && !isCompleted;
            const dayLog = mealLogs[dayNum] || { breakfast: { cals: 0, p: 0, c: 0 }, lunch: { cals: 0, p: 0, c: 0 }, dinner: { cals: 0, p: 0, c: 0 } };
            const totalDayCals = dayLog.breakfast.cals + dayLog.lunch.cals + dayLog.dinner.cals;
            const totalDayProtein = dayLog.breakfast.p + dayLog.lunch.p + dayLog.dinner.p;
            const totalDayCarbs = dayLog.breakfast.c + dayLog.lunch.c + dayLog.dinner.c;

            return (
              <div key={dayNum} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  onClick={() => {
                    if (isUnlocked) handleOpenModal(item);
                    else alert("🔒 Complete the previous day's workout to unlock this day!");
                  }}
                  style={{
                    background: isCompleted ? "rgba(34, 197, 94, 0.04)" : isToday ? "rgba(56, 189, 248, 0.07)" : "rgba(15, 23, 42, 0.35)",
                    border: isToday ? "1.5px solid #38bdf8" : isCompleted ? "1.5px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "20px",
                    padding: "16px 18px",
                    color: "#fff",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    opacity: isUnlocked ? 1 : 0.45,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      background: isCompleted ? "#22c55e" : isToday ? "linear-gradient(135deg, #38bdf8, #0284c7)" : "#1e293b",
                      color: isCompleted || isToday ? "#020617" : "#94a3b8",
                      width: "46px", height: "46px", borderRadius: "14px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: 900, fontSize: "14px"
                    }}>
                      <span style={{ fontSize: "7px", lineHeight: "1", opacity: 0.8, fontWeight: 700 }}>DAY</span>
                      <span>{dayNum}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff", marginBottom: "3px" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>⚡ {item.exercises?.length || 0} Exercises</span>
                        <span>•</span>
                        <span>⏱️ {item.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span style={{ fontSize: "11px", background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "6px 12px", borderRadius: "20px", fontWeight: 800 }}>✅ Done</span>
                    ) : isToday ? (
                      <span style={{ fontSize: "11px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "6px 12px", borderRadius: "20px", fontWeight: 800 }}>🔥 Start</span>
                    ) : (
                      <span style={{ fontSize: "11px", background: "rgba(255, 255, 255, 0.04)", color: "#64748b", padding: "6px 12px", borderRadius: "20px", fontWeight: 700 }}>🔒 Locked</span>
                    )}
                  </div>
                </div>

                {/* 🥗 FOOD SCAN & MACRO LOGGER CARD */}
                {isUnlocked && (
                  <div style={{ background: "rgba(15, 23, 42, 0.75)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "16px", padding: "14px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#38bdf8" }}>🥗 Daily Nutrition & Food Log (Day {dayNum})</span>
                      <span style={{ fontSize: "10px", color: "#4ade80", fontWeight: 700 }}>🔥 {totalDayCals} kcal | P: {totalDayProtein}g | C: {totalDayCarbs}g</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      {["breakfast", "lunch", "dinner"].map((mealType) => (
                        <div key={mealType} style={{ background: "rgba(3, 7, 18, 0.6)", padding: "8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>{mealType}</div>
                          <div style={{ fontSize: "11px", color: "#fff", marginBottom: "4px" }}>{dayLog[mealType].cals} kcal</div>
                          <button
                            onClick={() => handleTriggerFoodScan(dayNum, mealType)}
                            style={{ width: "100%", background: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "none", borderRadius: "6px", padding: "4px", fontSize: "9px", fontWeight: 800, cursor: "pointer" }}
                          >
                            + Log Food Scan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WORKOUT PLAYER MODAL WITH SCROLL BAR ADDED */}
        {selectedDayData && currentExercise && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "1px" }}>
            <div style={{ background: "#0b101d", width: "100%", maxWidth: "500px", borderRadius: "24px", border: "1px solid rgba(56,189,248,0.3)", padding: "14px 16px", boxSizing: "border-box", boxShadow: "0 15px 50px rgba(0,0,0,0.95)", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "92vh", overflowY: "auto" }}>

              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
                <div>
                  <span style={{ fontSize: "19px", color: playerMode === "rest" ? "#f59e0b" : "#38bdf8", fontWeight: 900, letterSpacing: "1px" }}>
                    {playerMode === "rest" ? "☕ REST TIME" : `⚡ SET ${currentSet} OF ${totalSetsCount}`}
                  </span>
                  <h2 style={{ fontSize: "17px", margin: "1px 0 0 0", color: "#fff", fontWeight: 900 }}>
                    {playerMode === "rest" ? "Get Ready for Next Exercise..." : currentExercise.name}
                  </h2>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "19px", fontWeight: 900, color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.3)" }}>
                    {sessionProgressPercent}% / 100%
                  </span>
                </div>
              </div>

              {/* PLAYER CARD / REST SCREEN */}
              <div style={{ background: "rgba(18, 24, 38, 0.9)", border: playerMode === "rest" ? "1.5px solid #f59e0b" : "1.5px solid #38bdf8", borderRadius: "18px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>

                {playerMode === "exercise" ? (
                  <>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8" }}>EXERCISE {activeExerciseIndex + 1} / {selectedDayData.exercises.length}</span>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "2px 8px", borderRadius: "6px" }}>{currentExercise.target}</span>
                    </div>

                    {/* 🖼️ HUGE 90% SCREEN VIEW AREA FOR GIF */}
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", background: "#030712", borderRadius: "14px", padding: "0px", border: "1px solid rgba(56,189,248,0.25)" }}>
                      <img
                        src={currentExercise.gifUrl || "/exercises/gif/1.gif"}
                        alt="Exercise Visual"
                        onError={(e) => { e.target.src = "/exercises/gif/1.gif"; }}
                        style={{
                          width: "100%",
                          maxWidth: "100%",
                          height: "370px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          imageRendering: "crisp-edges",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.85)",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ width: "100%", padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "42px", height: "42px", border: "4px solid rgba(245,158,11,0.2)", borderTop: "4px solid #f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#f59e0b" }}>Breathe & Get Ready! Rest Time Active</div>
                  </div>
                )}

                {/* TIMER & CONTROLS SECTION */}
                <div style={{ width: "100%", background: "rgba(3, 7, 18, 0.75)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "8px 10px", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "30px", fontWeight: 900, color: playerMode === "rest" ? "#f59e0b" : "#38bdf8", fontFamily: "monospace" }}>
                      {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: 800, background: playerMode === "rest" ? "rgba(245,158,11,0.15)" : "rgba(56, 189, 248, 0.15)", color: playerMode === "rest" ? "#f59e0b" : "#38bdf8", padding: "3px 8px", borderRadius: "10px" }}>
                      {playerMode === "rest" ? "☕ Rest Countdown" : `🔥 Set ${currentSet} Running`}
                    </span>
                  </div>

                  {/* TIMER SPEED SELECTOR */}
                  <div style={{ display: "flex", gap: "4px", width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontSize: "19px", fontWeight: 800, color: "#25b1ed", marginRight: "14px" }}>SPEED : </span>
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        style={{
                          background: speed === s ? "#38bdf8" : "rgba(255,255,255,0.06)",
                          color: speed === s ? "#030712" : "#cbd5e1",
                          border: speed === s ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "6px",
                          padding: "2px 8px",
                          fontWeight: 900,
                          fontSize: "15px",
                          cursor: "pointer"
                        }}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* START/PAUSE BUTTON WITH PREV & NEXT ARROWS */}
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", width: "100%" }}>

                    <button
                      onClick={handlePrevExercise}
                      disabled={activeExerciseIndex === 0}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: activeExerciseIndex === 0 ? "#475569" : "#fff", width: "50px", height: "50px", borderRadius: "10px", cursor: activeExerciseIndex === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 900 }}
                    >
                      ‹
                    </button>

                    <button
                      onClick={() => setIsStarted(!isStarted)}
                      style={{ flex: 1, background: isStarted ? "#eab308" : "#22c55e", color: "#030712", border: "none", borderRadius: "10px", padding: "10px", fontWeight: 500, fontSize: "20px", cursor: "pointer" }}
                    >
                      {isStarted ? "⏸ Pause" : "▶ Start Exercise"}
                    </button>

                    <button
                      onClick={handleNextExercise}
                      disabled={activeExerciseIndex === selectedDayData.exercises.length - 1}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: activeExerciseIndex === selectedDayData.exercises.length - 1 ? "#475569" : "#fff", width: "50px", height: "50px", borderRadius: "10px", cursor: activeExerciseIndex === selectedDayData.exercises.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 900 }}
                    >
                      ›
                    </button>

                  </div>

                  {/* Rest Phase Extra Actions (+10s and Skip Rest) */}
                  {playerMode === "rest" && (
                    <div style={{ display: "flex", gap: "6px", width: "100%", marginTop: "2px" }}>
                      <button
                        onClick={handleAddTenSeconds}
                        style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "8px", padding: "6px 10px", fontWeight: 900, fontSize: "30px", cursor: "pointer" }}
                      >
                        +10s Rest
                      </button>
                      <button
                        onClick={handleSkipRest}
                        style={{ flex: 1, background: "#38bdf8", color: "#030712", border: "none", borderRadius: "8px", padding: "6px", fontWeight: 900, fontSize: "20px", cursor: "pointer" }}
                      >
                        ⏭ Skip Rest
                      </button>
                    </div>
                  )}

                </div>

              </div>

              {/* Finish Workout Action Button */}
              {activeExerciseIndex === selectedDayData.exercises.length - 1 && (
                <button
                  onClick={() =>
                    handleCompleteWorkout(selectedDayData.day || 1)
                  }
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "15px",
                    fontWeight: 800,
                    fontSize: "18px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(34,197,94,0.4)"
                  }}
                >
                  Finish Workout 🎉
                </button>
              )}

            </div>
          </div>
        )}

      </div>

      {/* 🚀 FIXED BOTTOM NAVIGATION BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "rgba(2, 6, 23, 0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px", zIndex: 90, boxSizing: "border-box" }}>
        <div style={{ maxWidth: "540px", margin: "0 auto", display: "flex", justifyContent: "space-around", alignItems: "center" }}>

          <a href="/ai-coach" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "18px" }}>🤖</span>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8" }}>AI Coach</span>
          </a>

          <a href="/food-scanner" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "18px" }}>🥗</span>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#38bdf8" }}>Food Scan</span>
          </a>

        </div>
      </div>

      <style jsx>{`
        .card {
          width: 100%;
          max-width: 540px;
          height: 80px;
          border-radius: 12px;
          box-sizing: border-box;
          padding: 10px 15px;
          background-color: #ffffff;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 15px;
          margin: 0 auto 20px auto;
        }
        .wave {
          position: absolute;
          transform: rotate(90deg);
          left: -31px;
          top: 32px;
          width: 80px;
          fill: #04e4003a;
        }
        .icon-container {
          width: 35px;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #04e40048;
          border-radius: 50%;
          margin-left: 8px;
        }
        .icon {
          width: 17px;
          height: 17px;
          color: #269b24;
        }
        .message-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex-grow: 1;
        }
        .message-text,
        .sub-text {
          margin: 0;
          cursor: default;
        }
        .message-text {
          color: #269b24;
          font-size: 17px;
          font-weight: 700;
        }
        .sub-text {
          font-size: 14px;
          color: #555;
        }
        .cross-icon {
          width: 18px;
          height: 18px;
          color: #555;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}