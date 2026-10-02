"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

function CameraCardCapture({ onCapture }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setIsStreaming(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Camera permission denied or not supported.");
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "body-capture.jpg", { type: "image/jpeg" });
        onCapture(file);
        stopCamera();
      }
    }, "image/jpeg");
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsStreaming(false);
  };

  return (
    <div style={{ marginBottom: "10px", width: "300px" }}>
      {!isStreaming ? (
        <div style={{ display: "flex", justifyContent: "center", width: "300px", height: "auto" }}>
          <button type="button" onClick={startCamera} className="buttonupgrade">
            [°◉] - LIVE BODY SCAN
          </button>
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "16px", background: "#000", border: "1px solid rgba(255,255,255,0.15)" }}
          ></video>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={capturePhoto}
              style={{ flex: 1, padding: "12px", background: "#38bdf8", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
            >
              Capture 📸
            </button>
            <button
              type="button"
              onClick={stopCamera}
              style={{ flex: 1, padding: "12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

function formatVal(val) {
  if (typeof val !== "number") return val;
  const fixed = Number(val.toFixed(1));
  return Number.isInteger(fixed) ? Math.round(fixed) : fixed;
}

// Standard Circular Loader Card
function CircularLoaderCard({ title, current, max, unit, color = "#ff5232", customFontSize = "1.3rem" }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const numericCurrent = typeof current === "number" ? current : 0;
  const numericMax = typeof max === "number" && max > 0 ? max : 100;
  const percentage = Math.min(Math.max((numericCurrent / numericMax) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "13.5px", fontWeight: 800, color: "#cbd5e1", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
      
      <div style={{ position: "relative", width: "130px", height: "130px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }}>
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
          <circle cx="65" cy="65" r={radius} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="9" fill="transparent" />
          <circle cx="65" cy="65" r={radius} stroke={color} strokeWidth="9" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2, padding: "0 10px", textAlign: "center" }}>
          <span style={{ fontSize: customFontSize, fontWeight: 900, color: "#fff", lineHeight: "1.1" }}>
            {typeof current === "number" ? formatVal(current) : current}{unit}
          </span>
          <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>
            / {max}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// Extra Large Circular Loader Card (Testosterone)
function LargeCircularLoaderCard({ title, current, max, unit, color = "#ff5232" }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const numericCurrent = typeof current === "number" ? current : 0;
  const numericMax = typeof max === "number" && max > 0 ? max : 100;
  const percentage = Math.min(Math.max((numericCurrent / numericMax) * 100, 0), 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", gridColumn: "span 2" }}>
      <span style={{ fontSize: "14.5px", fontWeight: 800, color: "#cbd5e1", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
      
      <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
          <circle cx="80" cy="80" r={radius} stroke="rgba(255, 255, 255, 0.08)" strokeWidth="11" fill="transparent" />
          <circle cx="80" cy="80" r={radius} stroke={color} strokeWidth="11" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2, padding: "0 10px", textAlign: "center" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#fff", lineHeight: "1.1" }}>
            {typeof current === "number" ? formatVal(current) : current}{unit}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
            / {max}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BodyScanPage() {
  const { data: session } = useSession();
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [bodyUsage, setBodyUsage] = useState({
    plan: "free",
    used: 0,
    limit: 1,
    remaining: 1,
  });

  useEffect(() => {
    setIsMounted(true);
    if (session?.user?.isPro) {
      setIsPro(true);
    } else {
      const proStatus = localStorage.getItem("aurafit_is_pro") === "true";
      setIsPro(proStatus);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const loadEntitlements = async () => {
      try {
        const response = await fetch("/api/user/entitlements", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok && data?.success) {
          const plan = String(
            data?.plan || data?.planDetails?.name || "free"
          ).toLowerCase();

          setBodyUsage({
            plan,
            used: data?.usage?.bodyScans ?? 0,
            limit: data?.limits?.bodyScans ?? 1,
            remaining: data?.remaining?.bodyScans ?? 0,
          });

          setIsPro(plan !== "free");
        }
      } catch (error) {
        console.error("Body scan entitlement error:", error);
      }
    };

    loadEntitlements();
  }, [session]);

  if (!isMounted) {
    return <div style={{ minHeight: "100vh", background: "#080a0e" }}></div>;
  }

  const handleFileSelect = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
    });
  };

  const handleScan = async () => {
    if (!imageFile || loading) return;

    if (bodyUsage.remaining <= 0) {
      alert(
        `Daily Body Scan limit reached.\n\nUsed: ${bodyUsage.used}/${bodyUsage.limit}\nRemaining: 0`
      );
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onloadend = async () => {
        try {
          const rawBase64 = reader.result;
          const compressedBase64 = await compressImage(rawBase64);

          const res = await fetch("/api/body-scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              userId: session?.user?.email || "guest_user", 
              image: compressedBase64 
            }),
          });

          const data = await res.json();
          if (data.success) {
            setResult(data.analysis);

            if (data.usage) {
              setBodyUsage((prev) => ({
                ...prev,
                used: data.usage.used ?? prev.used,
                limit: data.usage.limit ?? prev.limit,
                remaining:
                  typeof data.usage.remaining === "number"
                    ? data.usage.remaining
                    : prev.remaining,
              }));
            }
          } else if (data.code === "DAILY_LIMIT_REACHED") {
            setBodyUsage((prev) => ({
              ...prev,
              used: data.used ?? prev.used,
              limit: data.limit ?? prev.limit,
              remaining: 0,
              plan: String(data?.plan || prev.plan || "free").toLowerCase(),
            }));
            alert(
              `Daily Body Scan limit reached.\n\nUsed: ${
                data.used ?? bodyUsage.used
              }/${data.limit ?? bodyUsage.limit}\nRemaining: 0`
            );
          } else {
            alert(data.error || "Failed to analyze physique image.");
          }
        } catch (innerErr) {
          console.error("Fetch/Compression error:", innerErr);
          alert("Server communication error.");
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error("FileReader error:", err);
      alert("Failed to read image file.");
      setLoading(false);
    }
  };

  const scrollToPricing = () => {
    window.location.href = "/pricing";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", padding: "24px 16px 110px 16px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/dashboard" style={{ padding: "8px 16px", textDecoration: "none", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#38bdf8", fontWeight: "bold" }}>
            ← Back
          </Link>
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0, letterSpacing: "0.5px" }}>AI Biometric & Physique Scan 🧬</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* BODY SCAN USAGE */}
        <div
          style={{
            width: "100%",
            marginBottom: "24px",
            padding: "16px",
            borderRadius: "18px",
            background: "linear-gradient(145deg, rgba(18,22,32,0.98), rgba(11,15,23,0.98))",
            border: "1px solid rgba(56,189,248,0.18)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>
                Current Plan
              </div>
              <div style={{ fontSize: "16px", fontWeight: 900, color: "#fff", textTransform: "capitalize" }}>
                {bodyUsage.plan}
              </div>
            </div>

            <div style={{ width: "1px", height: "42px", background: "rgba(255,255,255,0.1)" }} />

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "5px" }}>
                Body Scans
              </div>
              <div style={{ fontSize: "18px", fontWeight: 900, color: bodyUsage.remaining > 0 ? "#4ade80" : "#ef4444" }}>
                {bodyUsage.remaining}
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}> / {bodyUsage.limit} left</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "14px", width: "100%", height: "6px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div
              style={{
                width: `${bodyUsage.limit > 0 ? Math.min((bodyUsage.used / bodyUsage.limit) * 100, 100) : 0}%`,
                height: "100%",
                borderRadius: "10px",
                background: bodyUsage.remaining > 0 ? "#38bdf8" : "#ef4444",
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "9px", fontSize: "11px", color: "#64748b" }}>
            <span>Used today: {bodyUsage.used}</span>
            <span>Resets daily</span>
          </div>
        </div>

        {/* INPUT CARD */}
        <div className="card" style={{ width: "100%", height: "auto", marginBottom: "24px" }}>
          <div className="card2" style={{ width: "100%", height: "100%", padding: "20px", boxSizing: "border-box" }}>
            
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#38bdf8", textAlign: "center" }}>Capture or Upload Physique</h3>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <CameraCardCapture onCapture={handleFileSelect} />

              <label htmlFor="file" className="custum-file-upload">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path>
                  </svg>
                </div>
                <div className="text">
                  <span>Click to upload image</span>
                </div>
                <input id="file" type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} />
              </label>
            </div>

            <div style={{ width: "100%", height: "300px", background: "#0b0f17", borderRadius: "14px", border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "10px" }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Physique Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>No image selected yet</span>
              )}
            </div>

          </div>
        </div>

        {/* LOADING ANIMATION */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "30px 0" }}>
            <div className="loader-wrapper">
              <span className="loader-letter">G</span>
              <span className="loader-letter">e</span>
              <span className="loader-letter">n</span>
              <span className="loader-letter">e</span>
              <span className="loader-letter">r</span>
              <span className="loader-letter">a</span>
              <span className="loader-letter">t</span>
              <span className="loader-letter">i</span>
              <span className="loader-letter">n</span>
              <span className="loader-letter">g</span>
              <div className="loader"></div>
            </div>
            <p style={{ color: "#38bdf8", fontSize: "15px", marginTop: "18px", fontWeight: 700 }}>Analyzing Biometrics with AI...</p>
          </div>
        )}

        {/* RESULTS CARD */}
        {result && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* 1. BODY POSTURE ANALYSIS */}
            <div className="card fade-in-up">
              <div className="card2" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", color: "#4ade80", fontWeight: 700 }}>🧬 Body Posture Analysis</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {result.posturePoints && result.posturePoints.map((point, index) => (
                    <div key={index} className="stagger-item" style={{ animationDelay: `${index * 0.15}s`, background: "rgba(0,0,0,0.5)", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid #4ade80", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ background: "#4ade80", color: "#000", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900 }}>{index + 1}</span>
                        <span style={{ fontWeight: 700, fontSize: "15px", color: "#fff" }}>{point.label}</span>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#38bdf8" }}>{point.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. BODY COMPOSITION & METRICS */}
            <div className="card">
              <div className="card2" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", color: "#38bdf8", fontWeight: 700 }}>📊 Body Composition & Metrics</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", justifyItems: "center", alignItems: "center" }}>
                  <LargeCircularLoaderCard title="Testosterone" current={result.testosterone} max={result.maxTestosterone || 1000} unit=" ng/dL" color="#eab308" />
                  <CircularLoaderCard title="Body Fat" current={result.bodyFat} max={result.maxBodyFat || 30} unit="%" color="#38bdf8" />
                  <CircularLoaderCard title="Body Score" current={result.bodyScore} max={result.maxBodyScore || 10} unit="/10" color="#22c55e" />
                  <CircularLoaderCard title="Chest Size" current={result.chest} max={result.maxChest || 50} unit=" in" color="#8b5cf6" />
                  <CircularLoaderCard title="Metabolic Rate" current={result.rmr} max={result.maxRmr || 2500} unit=" kcal" color="#f59e0b" customFontSize="1.05rem" />
                </div>
              </div>
            </div>

            {/* 3. LOCKED PRO METRICS */}
            <div className="card">
              <div className="card2" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", color: "#fbbf24", fontWeight: 700 }}>🔒 Advanced Pro Biometrics</h3>
                
                <div className="lock-container">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px", justifyItems: "center", filter: isPro ? "none" : "blur(6px)", userSelect: isPro ? "auto" : "none" }}>
                    <CircularLoaderCard title="Waist" current={isPro ? result.waist : "██"} max={result.maxWaist || 45} unit=" in" color="#f43f5e" />
                    <CircularLoaderCard title="Neck & Shoulder" current={isPro ? result.neckShoulder : "██"} max={result.maxNeckShoulder || 2.0} unit=" ratio" color="#a855f7" />
                    <CircularLoaderCard title="Biceps" current={isPro ? result.biceps : "██"} max={result.maxBiceps || 20} unit=" in" color="#38bdf8" />
                    <CircularLoaderCard title="Hip" current={isPro ? result.hip : "██"} max={result.maxHip || 50} unit=" in" color="#22c55e" />
                  </div>

                  {!isPro && (
                    <div className="lock-overlay">
                      <button onClick={scrollToPricing} className="buttonupgrade">
                        <svg viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z"></path>
                        </svg>
                        Unlock Pro
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FIXED BOTTOM ANALYZE BUTTON BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "rgba(8, 10, 14, 0.95)", backdropFilter: "blur(10px)", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", zIndex: 100, boxSizing: "border-box" }}>
        <div style={{ maxWidth: "540px", margin: "0 auto" }}>
          <button
            onClick={handleScan}
            disabled={loading || !imageFile}
            className="button-main"
            style={{ width: "100%", opacity: (loading || !imageFile) ? 0.6 : 1, cursor: (loading || !imageFile) ? "not-allowed" : "pointer" }}
          >
            <div className="dots_border"></div>
            <span className="text_button">
              {loading ? "Analyzing Physique..." : "Run AI Diagnostic Scan"}
            </span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .card {
          background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
          border-radius: 22px;
          transition: all .3s;
        }

        .card2 {
          background-color: #121620;
          border-radius: 22px;
          transition: all .2s;
        }

        .card:hover {
          box-shadow: 0px 0px 35px 2px rgba(0, 255, 117, 0.35);
        }

        .lock-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          padding: 10px 0;
        }

        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(18, 22, 32, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .buttonupgrade {
          width: fit-content;
          display: flex;
          align-items: center;
          padding: 0.9em 1.2rem;
          cursor: pointer;
          gap: 0.5rem;
          font-weight: bold;
          font-size: 15px;
          border-radius: 30px;
          text-shadow: 2px 2px 3px rgba(221, 255, 0, 0.3);
          background: linear-gradient(
              15deg,
              #ddff00,
              #b8d100,
              #93a300,
              #6e7500,
              #ddff00,
              #b8d100,
              #93a300,
              #6e7500
            )
            no-repeat;
          background-size: 300%;
          color: #000;
          border: none;
          background-position: left center;
          box-shadow: 0 30px 10px -20px rgba(221, 255, 0, 0.2);
          transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease;
        }

        .buttonupgrade:hover {
          background-size: 320%;
          background-position: right center;
          transform: scale(1.05);
          color: #000;
        }

        .buttonupgrade:hover svg {
          fill: #000;
        }

        .buttonupgrade svg {
          width: 20px;
          fill: #000;
          transition: 0.3s ease;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }

        .stagger-item {
          opacity: 0;
          animation: fadeInUp 0.4s ease forwards;
        }

        .custum-file-upload {
          height: 140px;
          width: 100%;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          border: 2px dashed rgba(255,255,255,0.2);
          background-color: #1a1f2c;
          padding: 1rem;
          border-radius: 14px;
          box-shadow: 0px 20px 25px -15px rgba(0,0,0,0.5);
          transition: all 0.2s ease;
        }

        .custum-file-upload:hover {
          border-color: #38bdf8;
          background-color: #1f2536;
        }

        .custum-file-upload .icon svg {
          height: 45px;
          fill: #38bdf8;
        }

        .custum-file-upload .text span {
          font-weight: 600;
          font-size: 13px;
          color: #cbd5e1;
          text-align: center;
        }

        .custum-file-upload input {
          display: none;
        }

        .button-main {
          --black-700: hsla(0 0% 12% / 1);
          --border_radius: 17px;
          --transtion: 0.3s ease-in-out;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center;
          padding: 1rem 1.5rem;
          background-color: transparent;
          border: none;
          border-radius: var(--border_radius);
          transform: scale(calc(1 + (var(--active, 0) * 0.03)));
          transition: transform var(--transtion);
        }

        .button-main::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-color: var(--black-700);
          border-radius: var(--border_radius);
          box-shadow: inset 0 0.5px hsl(0, 100%, 99%), inset 0 -1px 2px 0 hsl(0, 0%, 99%),
            0px 4px 12px -4px hsla(0 100% 200% / calc(1 - var(--active, 0))),
            0 0 0 calc(var(--active, 0) * 0.375rem) hsl(260 97% 50% / 0.75);
          transition: all var(--transtion);
          z-index: 0;
        }

        .button-main::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-color: hsla(260 97% 61% / 0.75);
          background-image: radial-gradient(at 51% 89%, hsla(266, 45%, 74%, 1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, hsla(266, 36%, 60%, 1) 0px, transparent 50%),
            radial-gradient(at 22% 91%, hsla(266, 36%, 60%, 1) 0px, transparent 50%);
          background-position: top;
          opacity: var(--active, 0);
          border-radius: var(--border_radius);
          transition: opacity var(--transtion);
          z-index: 2;
        }

        .button-main:is(:hover, :focus-visible) {
          --active: 1;
        }

        .button-main .text_button {
          position: relative;
          z-index: 10;
          background-image: linear-gradient(90deg, rgb(255, 250, 250) 0%, hsla(0 0% 100% / var(--active, 0)) 120%);
          background-clip: text;
          font-size: 1.5rem;
          font-weight: 700;
          color: transparent;
          letter-spacing: 0.3px;
        }

        .loader-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 180px;
          font-family: "Inter", sans-serif;
          font-size: 1.2em;
          font-weight: 300;
          color: white;
          border-radius: 50%;
          background-color: transparent;
          user-select: none;
          margin: 0 auto;
        }

        .loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: transparent;
          animation: loader-rotate 2s linear infinite;
          z-index: 0;
        }

        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow: 0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset, 0 60px 60px 0 #471eec inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow: 0 10px 20px 0 #fff inset, 0 20px 10px 0 #d60a47 inset, 0 40px 60px 0 #311e80 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow: 0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset, 0 60px 60px 0 #471eec inset;
          }
        }

        .loader-letter {
          display: inline-block;
          opacity: 0.4;
          transform: translateY(0);
          animation: loader-letter-anim 2s infinite;
          z-index: 1;
          border-radius: 50ch;
          border: none;
        }

        .loader-letter:nth-child(1) { animation-delay: 0s; }
        .loader-letter:nth-child(2) { animation-delay: 0.1s; }
        .loader-letter:nth-child(3) { animation-delay: 0.2s; }
        .loader-letter:nth-child(4) { animation-delay: 0.3s; }
        .loader-letter:nth-child(5) { animation-delay: 0.4s; }
        .loader-letter:nth-child(6) { animation-delay: 0.5s; }
        .loader-letter:nth-child(7) { animation-delay: 0.6s; }
        .loader-letter:nth-child(8) { animation-delay: 0.7s; }
        .loader-letter:nth-child(9) { animation-delay: 0.8s; }
        .loader-letter:nth-child(10) { animation-delay: 0.9s; }

        @keyframes loader-letter-anim {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          20% { opacity: 1; transform: scale(1.15); }
          40% { opacity: 0.7; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}