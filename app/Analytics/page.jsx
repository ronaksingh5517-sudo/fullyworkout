"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [lastMeal, setLastMeal] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [weightData, setWeightData] = useState([
    { day: "Mon", weight: 0 },
    { day: "Tue", weight: 0 },
    { day: "Wed", weight: 0 },
    { day: "Thu", weight: 0 },
    { day: "Fri", weight: 0 },
    { day: "Sat", weight: 0 },
    { day: "Sun", weight: 0 },
  ]);

  const [waterData, setWaterData] = useState([
    { day: "Mon", water: 0 },
    { day: "Tue", water: 0 },
    { day: "Wed", water: 0 },
    { day: "Thu", water: 0 },
    { day: "Fri", water: 0 },
    { day: "Sat", water: 0 },
    { day: "Sun", water: 0 },
  ]);

  const [sleepData, setSleepData] = useState([
    { day: "Mon", sleep: 0 },
    { day: "Tue", sleep: 0 },
    { day: "Wed", sleep: 0 },
    { day: "Thu", sleep: 0 },
    { day: "Fri", sleep: 0 },
    { day: "Sat", sleep: 0 },
    { day: "Sun", sleep: 0 },
  ]);

  const [stepsData, setStepsData] = useState([
    { day: "Mon", steps: 0 },
    { day: "Tue", steps: 0 },
    { day: "Wed", steps: 0 },
    { day: "Thu", steps: 0 },
    { day: "Fri", steps: 0 },
    { day: "Sat", steps: 0 },
    { day: "Sun", steps: 0 },
  ]);

  const [foodCaloriesData, setFoodCaloriesData] = useState([
    { day: "Mon", calories: 0 },
    { day: "Tue", calories: 0 },
    { day: "Wed", calories: 0 },
    { day: "Thu", calories: 0 },
    { day: "Fri", calories: 0 },
    { day: "Sat", calories: 0 },
    { day: "Sun", calories: 0 },
  ]);

  const [workoutPRData, setWorkoutPRData] = useState([
    { exercise: "Bench Press", weight: 0 },
    { exercise: "Squat", weight: 0 },
    { exercise: "Deadlift", weight: 0 },
    { exercise: "Shoulder Press", weight: 0 },
  ]);

  useEffect(() => {
    setIsLoaded(true);

    const fetchAnalyticsData = async () => {
      try {
        const userEmail = session?.user?.email;
        if (!userEmail) {
          // Fallback to localStorage if session isn't ready
          const savedUser = localStorage.getItem("aurafit_user");
          if (savedUser) setUserData(JSON.parse(savedUser));

          const savedMeal = localStorage.getItem("aurafit_last_scanned_meal");
          if (savedMeal) {
            const meal = JSON.parse(savedMeal);
            setLastMeal(meal);
            setFoodCaloriesData((prev) =>
              prev.map((item, idx) => (idx === 6 ? { ...item, calories: meal.totalCalories || 0 } : item))
            );
          }
          return;
        }

        // Fetch real data from MongoDB API route
        const res = await fetch(`/api/analytics?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();

        if (data.success) {
          if (data.userData) setUserData(data.userData);
          if (data.lastMeal) setLastMeal(data.lastMeal);
          if (data.weightData) setWeightData(data.weightData);
          if (data.waterData) setWaterData(data.waterData);
          if (data.sleepData) setSleepData(data.sleepData);
          if (data.stepsData) setStepsData(data.stepsData);
          if (data.foodCaloriesData) setFoodCaloriesData(data.foodCaloriesData);
          if (data.workoutPRData) setWorkoutPRData(data.workoutPRData);
        }
      } catch (err) {
        console.error("Error fetching analytics from DB:", err);
      }
    };

    fetchAnalyticsData();
  }, [session]);

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#fff", padding: "24px 16px 100px 16px", opacity: isLoaded ? 1 : 0, transition: "opacity 0.3s ease-in-out", boxSizing: "border-box", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
        
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>AuraFit Pro</span>
            <h1 style={{ fontSize: "22px", fontWeight: 900, margin: "2px 0 0 0", color: "#fff" }}>Analytics & Progress 📈</h1>
          </div>
          <Link href="/ai-coach" style={{ fontSize: "13px", background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", padding: "10px 16px", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", boxShadow: "0 4px 12px rgba(122,69,255,0.3)" }}>AI Coach 🤖</Link>
        </div>

        {/* User Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "#121620", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}>ACTIVE GOAL</div>
            <div style={{ fontSize: "16px", fontWeight: 900, color: "#38bdf8", wordBreak: "break-word" }}>{userData?.goal || "Transformation"}</div>
          </div>
          <div style={{ background: "#121620", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}>FITNESS LEVEL</div>
            <div style={{ fontSize: "16px", fontWeight: 900, color: "#4ade80" }}>{userData?.level || "Beginner"}</div>
          </div>
        </div>

        {/* 1. CONSISTENCY & STREAK TRACKER */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "10px", color: "#f59e0b", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Habit Tracker</span>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "15px", fontWeight: 800, color: "#fff" }}>⚡ Consistency Streak</h3>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 900 }}>
              🔥 {userData?.streak || 0} Days Streak
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginTop: "12px" }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1 }}>
                <div style={{ 
                  width: "32px", height: "32px", borderRadius: "10px", 
                  background: "rgba(255,255,255,0.03)", 
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#64748b", fontSize: "12px", fontWeight: 900
                }}>
                  ·
                </div>
                <span style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. FOOD & CALORIES INTAKE CHART */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff" }}>🍽️️ Food & Calorie Intake (kcal)</h3>
            <span style={{ fontSize: "11px", color: "#facc15", background: "rgba(250,204,21,0.1)", padding: "4px 8px", borderRadius: "8px", fontWeight: 700 }}>Synced</span>
          </div>
          <div style={{ width: "100%", height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={foodCaloriesData}>
                <defs>
                  <linearGradient id="foodColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 3000]} hide={true} />
                <Tooltip contentStyle={{ background: "#030712", borderColor: "rgba(250,204,21,0.3)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="calories" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#foodColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. WEIGHT PROGRESS CHART */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff" }}>📉 Weight Progress (kg)</h3>
            <span style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "4px 8px", borderRadius: "8px", fontWeight: 700 }}>Live Tracker</span>
          </div>
          <div style={{ width: "100%", height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} hide={true} />
                <Tooltip contentStyle={{ background: "#030712", borderColor: "rgba(56,189,248,0.3)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="weight" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#weightColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. SLEEP TRACKING CHART */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff" }}>😴 Sleep Recovery (Hours)</h3>
            <span style={{ fontSize: "11px", color: "#a78bfa", background: "rgba(167,139,250,0.1)", padding: "4px 8px", borderRadius: "8px", fontWeight: 700 }}>Active</span>
          </div>
          <div style={{ width: "100%", height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData}>
                <defs>
                  <linearGradient id="sleepColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 12]} hide={true} />
                <Tooltip contentStyle={{ background: "#030712", borderColor: "rgba(167,139,250,0.3)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="sleep" stroke="#a78bfa" strokeWidth={3} fillOpacity={1} fill="url(#sleepColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. DAILY STEPS / WALKING CHART */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff" }}>👟 Daily Steps Tracker</h3>
            <span style={{ fontSize: "11px", color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "4px 8px", borderRadius: "8px", fontWeight: 700 }}>Live</span>
          </div>
          <div style={{ width: "100%", height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepsData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 15000]} hide={true} />
                <Tooltip contentStyle={{ background: "#030712", borderColor: "rgba(34,197,94,0.3)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="steps" fill="#4ade80" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. WORKOUT PRS CHART */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff" }}>🏋️ Workout PRs (Max Lift in kg)</h3>
            <span style={{ fontSize: "11px", color: "#f87171", background: "rgba(248,113,113,0.1)", padding: "4px 8px", borderRadius: "8px", fontWeight: 700 }}>PR Log</span>
          </div>
          <div style={{ width: "100%", height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutPRData} layout="vertical">
                <XAxis type="number" domain={[0, 200]} hide={true} />
                <YAxis dataKey="exercise" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: "#030712", borderColor: "rgba(248,113,113,0.3)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="weight" fill="#f87171" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. WATER INTAKE TRACKER */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff" }}>💧 Water Intake (Liters)</h3>
            <span style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "4px 8px", borderRadius: "8px", fontWeight: 700 }}>Hydration</span>
          </div>
          <div style={{ width: "100%", height: "160px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterData}>
                <defs>
                  <linearGradient id="waterColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 5]} hide={true} />
                <Tooltip contentStyle={{ background: "#030712", borderColor: "rgba(56,189,248,0.3)", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="water" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#waterColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. LATEST NUTRITION LOG DETAILS */}
        <div style={{ background: "#121620", padding: "20px", borderRadius: "20px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ color: "#4ade80", margin: "0 0 12px 0", fontSize: "15px", fontWeight: 800 }}>🍎 Latest Nutrition Log</h3>
          {lastMeal ? (
            <div>
              <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", margin: "0 0 6px 0" }}>{lastMeal.dishName}</p>
              <p style={{ fontSize: "13px", color: "#cbd5e1", margin: "0 0 12px 0" }}>Total Energy: <strong style={{ color: "#fff" }}>{lastMeal.totalCalories} kcal</strong></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "12px" }}>
                <span style={{ background: "rgba(74, 222, 128, 0.12)", color: "#4ade80", padding: "6px 10px", borderRadius: "8px", fontWeight: 700 }}>Protein: {lastMeal.totalProtein}</span>
                <span style={{ background: "rgba(250, 204, 21, 0.12)", color: "#facc15", padding: "6px 10px", borderRadius: "8px", fontWeight: 700 }}>Carbs: {lastMeal.totalCarbs}</span>
                <span style={{ background: "rgba(239, 68, 68, 0.12)", color: "#ef4444", padding: "6px 10px", borderRadius: "8px", fontWeight: 700 }}>Fats: {lastMeal.totalFats}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>No recent meals logged.</p>
              <Link href="/food-scanner" style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700, textDecoration: "none" }}>Scan Meal →</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}