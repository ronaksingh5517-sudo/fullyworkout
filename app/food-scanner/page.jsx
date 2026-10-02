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

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File(
          [blob],
          "meal-capture.jpg",
          {
            type: "image/jpeg",
          }
        );

        onCapture(file);
        stopCamera();
      }
    }, "image/jpeg");
  };

  const stopCamera = () => {
    const stream =
      videoRef.current?.srcObject;

    if (stream) {
      stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsStreaming(false);
  };

  return (
    <div
      style={{
        marginBottom: "10px",
        width: "300px",
      }}
    >
      {!isStreaming ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "300px",
            height: "auto",
          }}
        >
          <button
            type="button"
            onClick={startCamera}
            className="buttonupgrade"
          >
            [°◉] - FOOD SCAN
          </button>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
              borderRadius: "16px",
              background: "#000",
              border:
                "1px solid rgba(255,255,255,0.15)",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <button
              type="button"
              onClick={capturePhoto}
              style={{
                flex: 1,
                padding: "12px",
                background: "#38bdf8",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Capture 📸
            </button>

            <button
              type="button"
              onClick={stopCamera}
              style={{
                flex: 1,
                padding: "12px",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </div>
  );
}

function formatVal(val) {
  if (typeof val !== "number") return val;

  const fixed = Number(val.toFixed(1));

  return Number.isInteger(fixed)
    ? Math.round(fixed)
    : fixed;
}

function CircularLoaderCard({
  title,
  current,
  max,
  unit,
  color = "#ff5232",
}) {
  const radius = 50;

  const circumference =
    2 * Math.PI * radius;

  const numericCurrent =
    typeof current === "number"
      ? current
      : 0;

  const numericMax =
    typeof max === "number" && max > 0
      ? max
      : 100;

  const percentage = Math.min(
    Math.max(
      (numericCurrent / numericMax) * 100,
      0
    ),
    100
  );

  const strokeDashoffset =
    circumference -
    (percentage / 100) * circumference;

  const leftAmount = Math.max(
    numericMax - numericCurrent,
    0
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontSize: "13.5px",
          fontWeight: 800,
          color: "#cbd5e1",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </span>

      <div
        style={{
          position: "relative",
          width: "130px",
          height: "130px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.45)",
          borderRadius: "50%",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <svg
          width="130"
          height="130"
          viewBox="0 0 130 130"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(-90deg)",
          }}
        >
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="9"
            fill="transparent"
          />

          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke={color}
            strokeWidth="9"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 0.8s ease-in-out",
            }}
          />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "#fff",
              lineHeight: "1.1",
            }}
          >
            {typeof current === "number"
              ? formatVal(current)
              : current}
            {unit}
          </span>

          <span
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              marginTop: "3px",
            }}
          >
            / {max}
            {unit}
          </span>
        </div>
      </div>

      <span
        style={{
          fontSize: "12.5px",
          fontWeight: 700,
          color: "#4ade80",
          background:
            "rgba(34, 197, 94, 0.1)",
          padding: "3px 10px",
          borderRadius: "20px",
          border:
            "1px solid rgba(34, 197, 94, 0.2)",
        }}
      >
        {typeof leftAmount === "number"
          ? formatVal(leftAmount)
          : leftAmount}
        {unit} left
      </span>
    </div>
  );
}

export default function FoodScannerPage() {
  const { data: session } = useSession();

  const [imageFile, setImageFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [isPro, setIsPro] =
    useState(false);

  const [isMounted, setIsMounted] =
    useState(false);

  // --------------------------------------------------
  // FOOD SCAN DAILY USAGE
  // --------------------------------------------------

  const [foodUsage, setFoodUsage] = useState({
    plan: "free",
    used: 0,
    limit: 1,
    remaining: 1,
  });

  // --------------------------------------------------
  // PRO STATUS
  // --------------------------------------------------

  useEffect(() => {
    setIsMounted(true);

    if (session?.user?.isPro) {
      setIsPro(true);
    } else {
      const proStatus =
        localStorage.getItem(
          "aurafit_is_pro"
        ) === "true";

      setIsPro(proStatus);
    }
  }, [session]);
  // --------------------------------------------------
  // LOAD CENTRAL USER ENTITLEMENTS
  // --------------------------------------------------

  useEffect(() => {
    if (!session?.user?.email) return;

    const loadEntitlements = async () => {
      try {
        const response = await fetch(
          "/api/user/entitlements",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data?.success) {
          setFoodUsage({
            plan: String(data?.plan || data?.planDetails?.name || "free").toLowerCase(),

            used:
              data.usage?.foodScans ?? 0,

            limit:
              data.limits?.foodScans ?? 1,

            remaining:
              data.remaining?.foodScans ?? 0,
          });

          // Central plan is now the source of truth.
          // No separate feature plan is used.
          const centralPlan = String(
            data?.plan || data?.planDetails?.name || "free"
          ).toLowerCase();

          setIsPro(
            centralPlan !== "free"
          );
        } else {
          setFoodUsage({
            plan: "free",
            used: 0,
            limit: 1,
            remaining: 1,
          });

          setIsPro(false);
        }
      } catch (error) {
        console.error(
          "Entitlements fetch error:",
          error
        );

        setFoodUsage({
          plan: "free",
          used: 0,
          limit: 1,
          remaining: 1,
        });

        setIsPro(false);
      }
    };

    loadEntitlements();
  }, [session]);

  // --------------------------------------------------
  // FILE SELECT
  // --------------------------------------------------

  const handleFileSelect = (file) => {
    if (!file) return;

    setImageFile(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );

    setResult(null);
  };

  // --------------------------------------------------
  // FOOD SCAN
  // --------------------------------------------------

  const handleScan = async () => {
    if (!imageFile) return;

    // Extra UI protection.
    // Actual quota is still enforced by server.
    if (foodUsage.remaining <= 0) {
      alert(
        "Daily Food Scan limit reached."
      );

      return;
    }

    setLoading(true);

    try {
      const reader =
        new FileReader();

      reader.readAsDataURL(imageFile);

      reader.onload = async () => {
        const base64Image =
          reader.result;

        try {
          const response =
            await fetch(
              "/api/food-scan",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  imageBase64:
                    base64Image,

                  userId:
                    session?.user
                      ?.email ||
                    "guest_user",
                }),
              }
            );

          const data =
            await response.json();

          // --------------------------------------------------
          // SUCCESS
          // --------------------------------------------------

          if (
            response.ok &&
            data.success
          ) {
            const res =
              data.analysis;

            setResult({
              dishName:
                res.dishName,

              items:
                res.items,

              totalCalories:
                res.totalCalories,

              maxCalories: 2000,

              protein:
                parseFloat(
                  res.totalProtein
                ) || 30,

              maxProtein: 100,

              carbs:
                parseFloat(
                  res.totalCarbs
                ) || 50,

              maxCarbs: 250,

              fat:
                parseFloat(
                  res.totalFats
                ) || 15,

              maxFat: 70,

              cholesterol: 120,

              maxCholesterol: 300,

              omega3: 420,

              maxOmega3: 1000,

              fiber: 12.4,

              maxFiber: 30,

              sodium: 640,

              maxSodium: 2300,

              sugar: 14,

              maxSugar: 50,

              caffeine: 80,

              maxCaffeine: 400,

              vitD: 8.5,

              maxVitD: 20,

              vitC: 45,

              maxVitC: 90,

              iron: 4.2,

              maxIron: 18,

              calcium: 600,

              maxCalcium: 1000,
            });

            // --------------------------------------------------
            // UPDATE UI QUOTA
            // --------------------------------------------------

            if (data.usage) {
              setFoodUsage((prev) => ({
                plan: prev.plan,
                used: data.usage.used ?? prev.used,
                limit: data.usage.limit ?? prev.limit,
                remaining:
                  typeof data.usage.remaining === "number"
                    ? data.usage.remaining
                    : prev.remaining,
              }));
            }
          }

          // --------------------------------------------------
          // DAILY LIMIT
          // --------------------------------------------------

          else if (
            data.code ===
            "DAILY_LIMIT_REACHED"
          ) {
            setFoodUsage((prev) => ({
              ...prev,
              used:
                data.used ??
                prev.used,

              limit:
                data.limit ??
                prev.limit,

              remaining: 0,

              plan: String(
                data?.plan ||
                data?.planDetails?.name ||
                prev.plan ||
                "free"
              ).toLowerCase(),
            }));

            alert(
              `Daily Food Scan limit reached.\n\nUsed: ${data.used ?? 0
              }/${data.limit ?? 0}\nRemaining: 0`
            );
          }

          // --------------------------------------------------
          // AUTH REQUIRED
          // --------------------------------------------------

          else if (
            data.code ===
            "AUTH_REQUIRED"
          ) {
            alert(
              "Please login to use Food Scanner."
            );

            window.location.href =
              "/login";
          }

          // --------------------------------------------------
          // OTHER ERROR
          // --------------------------------------------------

          else {
            alert(
              data.error ||
              "AI Scan failed. Please try again."
            );
          }
        } catch (error) {
          console.error(
            "Food Scan API Error:",
            error
          );

          alert(
            "Network error or High Demand. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error(
        "File Reader Error:",
        err
      );

      alert(
        "Could not read image. Please try again."
      );

      setLoading(false);
    }
  };

  // --------------------------------------------------
  // PRICING
  // --------------------------------------------------

  const scrollToPricing = () => {
    window.location.href =
      "/pricing";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080a0e",
        color: "#ffffff",
        padding:
          "24px 16px 110px 16px",
        fontFamily:
          "system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "540px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              padding: "8px 16px",
              textDecoration: "none",
              background: "#1a1a1a",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#38bdf8",
              fontWeight: "bold",
            }}
          >
            ← Back
          </Link>

          <h1
            style={{
              fontSize: "18px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            Vision Food Scanner 📸
          </h1>

          <div
            style={{
              width: "40px",
            }}
          />
        </div>

        {/* FOOD SCAN USAGE */}

        <div
          style={{
            width: "100%",
            marginBottom: "24px",
            padding: "16px",
            borderRadius: "18px",
            background:
              "linear-gradient(145deg, rgba(18,22,32,0.98), rgba(11,15,23,0.98))",
            border:
              "1px solid rgba(56,189,248,0.18)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.25)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* PLAN */}

            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform:
                    "uppercase",
                  marginBottom: "5px",
                }}
              >
                Current Plan
              </div>

              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#fff",
                  textTransform:
                    "capitalize",
                }}
              >
                {foodUsage.plan}
              </div>
            </div>

            {/* DIVIDER */}

            <div
              style={{
                width: "1px",
                height: "42px",
                background:
                  "rgba(255,255,255,0.1)",
              }}
            />

            {/* SCANS */}

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform:
                    "uppercase",
                  marginBottom: "5px",
                }}
              >
                Food Scans
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  color:
                    foodUsage.remaining >
                      0
                      ? "#4ade80"
                      : "#ef4444",
                }}
              >
                {foodUsage.remaining}

                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  / {foodUsage.limit}{" "}
                  left
                </span>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}

          <div
            style={{
              marginTop: "14px",
              width: "100%",
              height: "6px",
              borderRadius: "10px",
              background:
                "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${foodUsage.limit >
                  0
                  ? Math.min(
                    (foodUsage.used /
                      foodUsage.limit) *
                    100,
                    100
                  )
                  : 0
                  }%`,
                height: "100%",
                borderRadius: "10px",
                background:
                  foodUsage.remaining >
                    0
                    ? "#38bdf8"
                    : "#ef4444",
                transition:
                  "width 0.4s ease",
              }}
            />
          </div>

          {/* TODAY */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginTop: "9px",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            <span>
              Used today:{" "}
              {foodUsage.used}
            </span>

            <span>
              Resets daily
            </span>
          </div>
        </div>

        {/* INPUT CARD */}

        <div
          className="card"
          style={{
            width: "100%",
            height: "auto",
            marginBottom: "24px",
          }}
        >
          <div
            className="card2"
            style={{
              width: "100%",
              height: "100%",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                margin:
                  "0 0 16px 0",
                fontSize: "16px",
                fontWeight: 700,
                color: "#38bdf8",
                textAlign: "center",
              }}
            >
              Capture or Upload Meal
              Photo
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent:
                  "center",
                gap: "16px",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              <CameraCardCapture
                onCapture={
                  handleFileSelect
                }
              />

              <label
                htmlFor="file"
                className="custum-file-upload"
              >
                <div className="icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill=""
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8953 21 11 20.1046 11 19C11 17.1305 12.2825 15.5606 14.0156 15.122C14.2076 12.8136 16.142 11 16.5 11C18.858 11 20.7924 12.8136 20.9844 15.122C22.7175 15.5606 24 17.1305 24 19C24 21.2091 22.2091 23 20 23H13C10.7909 23 9 21.2091 9 19C9 17.1305 10.2825 15.5606 12.0156 15.122C12.2076 12.8136 14.142 11 16.5 11Z"
                      fill=""
                    />
                  </svg>
                </div>

                <div className="text">
                  <span>
                    Click to upload
                    image
                  </span>
                </div>

                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileSelect(
                      e.target.files[0]
                    )
                  }
                />
              </label>
            </div>

            <div
              style={{
                width: "100%",
                height: "300px",
                background: "#0b0f17",
                border:
                  "1px dashed rgba(255,255,255,0.2)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Meal Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  No image selected
                  yet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              alignItems: "center",
              justifyContent:
                "center",
              margin: "30px 0",
            }}
          >
            <div className="loader-wrapper">
              <span className="loader-letter">
                G
              </span>
              <span className="loader-letter">
                e
              </span>
              <span className="loader-letter">
                n
              </span>
              <span className="loader-letter">
                e
              </span>
              <span className="loader-letter">
                r
              </span>
              <span className="loader-letter">
                a
              </span>
              <span className="loader-letter">
                t
              </span>
              <span className="loader-letter">
                i
              </span>
              <span className="loader-letter">
                n
              </span>
              <span className="loader-letter">
                g
              </span>

              <div className="loader" />
            </div>

            <p
              style={{
                color: "#38bdf8",
                fontSize: "15px",
                marginTop: "18px",
                fontWeight: 700,
              }}
            >
              Analyzing Food with
              AI...
            </p>
          </div>
        )}

        {/* RESULTS */}

        {result && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "20px",
            }}
          >
            {/* DISH ITEMS */}

            <div className="card fade-in-up">
              <div
                className="card2"
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 6px 0",
                    fontSize: "17px",
                    color: "#4ade80",
                    fontWeight: 700,
                  }}
                >
                  🍽️ Detected Plate
                  Items
                </h3>

                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    margin:
                      "0 0 16px 0",
                    color: "#fff",
                  }}
                >
                  {result.dishName}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "10px",
                  }}
                >
                  {result.items &&
                    result.items.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={index}
                          className="stagger-item"
                          style={{
                            animationDelay: `${index *
                              0.15
                              }s`,
                            background:
                              "rgba(0,0,0,0.5)",
                            padding:
                              "12px 16px",
                            borderRadius:
                              "12px",
                            borderLeft:
                              "4px solid #38bdf8",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "12px",
                            }}
                          >
                            <span
                              style={{
                                background:
                                  "#38bdf8",
                                color:
                                  "#000",
                                width:
                                  "24px",
                                height:
                                  "24px",
                                borderRadius:
                                  "50%",
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  900,
                              }}
                            >
                              {index +
                                1}
                            </span>

                            <span
                              style={{
                                fontWeight:
                                  700,
                                fontSize:
                                  "15px",
                                color:
                                  "#fff",
                              }}
                            >
                              {item.name}
                            </span>
                          </div>

                          <span
                            style={{
                              fontSize:
                                "13px",
                              color:
                                "#94a3b8",
                            }}
                          >
                            {item.calories}{" "}
                            kcal (
                            {
                              item.protein
                            }
                            P,{" "}
                            {item.carbs}
                            C,{" "}
                            {item.fat}
                            F)
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* NUTRIENTS */}

            <div className="card">
              <div
                className="card2"
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 16px 0",
                    fontSize: "17px",
                    color: "#38bdf8",
                    fontWeight: 700,
                  }}
                >
                  📊 Nutrients
                  Overview
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "28px",
                    justifyItems:
                      "center",
                  }}
                >
                  <CircularLoaderCard
                    title="Calories"
                    current={
                      result.totalCalories
                    }
                    max={
                      result.maxCalories ||
                      2000
                    }
                    unit=" kcal"
                    color="#ff5232"
                  />

                  <CircularLoaderCard
                    title="Protein"
                    current={
                      result.protein
                    }
                    max={
                      result.maxProtein ||
                      100
                    }
                    unit="g"
                    color="#8b5cf6"
                  />

                  <CircularLoaderCard
                    title="Carbs"
                    current={
                      result.carbs
                    }
                    max={
                      result.maxCarbs ||
                      250
                    }
                    unit="g"
                    color="#22c55e"
                  />

                  <CircularLoaderCard
                    title="Fat"
                    current={
                      result.fat
                    }
                    max={
                      result.maxFat ||
                      70
                    }
                    unit="g"
                    color="#ef4444"
                  />
                </div>
              </div>
            </div>

            {/* HEART HEALTH */}

            <div className="card">
              <div
                className="card2"
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 16px 0",
                    fontSize: "17px",
                    color: "#f43f5e",
                    fontWeight: 700,
                  }}
                >
                  ❤️ Heart Health
                  Breakdown
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "28px",
                    justifyItems:
                      "center",
                  }}
                >
                  <CircularLoaderCard
                    title="Cholesterol"
                    current={
                      result.cholesterol
                    }
                    max={
                      result.maxCholesterol ||
                      300
                    }
                    unit="mg"
                    color="#f43f5e"
                  />

                  <CircularLoaderCard
                    title="Omega-3"
                    current={
                      result.omega3
                    }
                    max={
                      result.maxOmega3 ||
                      1000
                    }
                    unit="mg"
                    color="#4ade80"
                  />

                  <CircularLoaderCard
                    title="Fiber"
                    current={
                      result.fiber
                    }
                    max={
                      result.maxFiber ||
                      30
                    }
                    unit="g"
                    color="#10b981"
                  />

                  <CircularLoaderCard
                    title="Sodium"
                    current={
                      result.sodium
                    }
                    max={
                      result.maxSodium ||
                      2300
                    }
                    unit="mg"
                    color="#f59e0b"
                  />
                </div>
              </div>
            </div>

            {/* NUTRIENTS TO LIMIT */}

            <div className="card">
              <div
                className="card2"
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 16px 0",
                    fontSize: "17px",
                    color: "#fbbf24",
                    fontWeight: 700,
                  }}
                >
                  ⚠️ Nutrients to
                  Limit
                </h3>

                <div className="lock-container">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "28px",
                      justifyItems:
                        "center",
                      filter: isPro
                        ? "none"
                        : "blur(6px)",
                      userSelect: isPro
                        ? "auto"
                        : "none",
                    }}
                  >
                    <CircularLoaderCard
                      title="Sugar"
                      current={
                        isPro
                          ? result.sugar
                          : "██"
                      }
                      max={
                        result.maxSugar ||
                        50
                      }
                      unit="g"
                      color="#fbbf24"
                    />

                    <CircularLoaderCard
                      title="Caffeine"
                      current={
                        isPro
                          ? result.caffeine
                          : "██"
                      }
                      max={
                        result.maxCaffeine ||
                        400
                      }
                      unit="mg"
                      color="#eab308"
                    />
                  </div>

                  {!isPro && (
                    <div className="lock-overlay">
                      <button
                        onClick={
                          scrollToPricing
                        }
                        className="buttonupgrade"
                      >
                        <svg
                          viewBox="0 0 36 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
                        </svg>

                        Unlock Pro
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* KEY VITAMINS */}

            <div className="card">
              <div
                className="card2"
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 16px 0",
                    fontSize: "17px",
                    color: "#38bdf8",
                    fontWeight: 700,
                  }}
                >
                  💊 Key Vitamins
                </h3>

                <div className="lock-container">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "28px",
                      justifyItems:
                        "center",
                      filter: isPro
                        ? "none"
                        : "blur(6px)",
                      userSelect: isPro
                        ? "auto"
                        : "none",
                    }}
                  >
                    <CircularLoaderCard
                      title="Vitamin D"
                      current={
                        isPro
                          ? result.vitD
                          : "██"
                      }
                      max={
                        result.maxVitD ||
                        20
                      }
                      unit="mcg"
                      color="#38bdf8"
                    />

                    <CircularLoaderCard
                      title="Vitamin C"
                      current={
                        isPro
                          ? result.vitC
                          : "██"
                      }
                      max={
                        result.maxVitC ||
                        90
                      }
                      unit="mg"
                      color="#0ea5e9"
                    />
                  </div>

                  {!isPro && (
                    <div className="lock-overlay">
                      <button
                        onClick={
                          scrollToPricing
                        }
                        className="buttonupgrade"
                      >
                        <svg
                          viewBox="0 0 36 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
                        </svg>

                        Unlock Pro
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* VITAL MINERALS */}

            <div className="card">
              <div
                className="card2"
                style={{
                  padding: "20px",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 16px 0",
                    fontSize: "17px",
                    color: "#a855f7",
                    fontWeight: 700,
                  }}
                >
                  🧪 Vital Minerals
                </h3>

                <div className="lock-container">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "28px",
                      justifyItems:
                        "center",
                      filter: isPro
                        ? "none"
                        : "blur(6px)",
                      userSelect: isPro
                        ? "auto"
                        : "none",
                    }}
                  >
                    <CircularLoaderCard
                      title="Iron"
                      current={
                        isPro
                          ? result.iron
                          : "██"
                      }
                      max={
                        result.maxIron ||
                        18
                      }
                      unit="mg"
                      color="#a855f7"
                    />

                    <CircularLoaderCard
                      title="Calcium"
                      current={
                        isPro
                          ? result.calcium
                          : "██"
                      }
                      max={
                        result.maxCalcium ||
                        1000
                      }
                      unit="mg"
                      color="#c084fc"
                    />
                  </div>

                  {!isPro && (
                    <div className="lock-overlay">
                      <button
                        onClick={
                          scrollToPricing
                        }
                        className="buttonupgrade"
                      >
                        <svg
                          viewBox="0 0 36 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m18 0 8 12 10-8-4 20H4L0 4l10 8 8-12z" />
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

        {/* FIXED BOTTOM ANALYZE BUTTON */}

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background:
              "rgba(8, 10, 14, 0.95)",
            backdropFilter:
              "blur(10px)",
            padding:
              "14px 20px",
            borderTop:
              "1px solid rgba(255,255,255,0.08)",
            zIndex: 100,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            <button
              onClick={handleScan}
              disabled={
                loading ||
                !imageFile ||
                foodUsage.remaining <= 0
              }
              className="button-main"
              style={{
                width: "100%",
                opacity:
                  loading ||
                    !imageFile ||
                    foodUsage.remaining <=
                    0
                    ? 0.6
                    : 1,
                cursor:
                  loading ||
                    !imageFile ||
                    foodUsage.remaining <=
                    0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              <div className="dots_border" />

              <span className="text_button">
                {loading
                  ? "Analyzing Meal..."
                  : foodUsage.remaining <=
                    0
                    ? "Daily Scan Limit Reached"
                    : "Scan Food with AI"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .card {
          background-image: linear-gradient(
            163deg,
            #00ff75 0%,
            #3700ff 100%
          );
          border-radius: 22px;
          transition: all 0.3s;
        }

        .card2 {
          background-color: #121620;
          border-radius: 22px;
          transition: all 0.2s;
        }

        .card:hover {
          box-shadow:
            0px 0px 35px 2px
            rgba(0, 255, 117, 0.35);
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
          background:
            rgba(18, 22, 32, 0.75);
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
          text-shadow:
            2px 2px 3px
            rgba(221, 255, 0, 0.3);
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
          ) no-repeat;
          background-size: 300%;
          color: #000;
          border: none;
          background-position: left center;
          box-shadow:
            0 30px 10px -20px
            rgba(221, 255, 0, 0.2);
          transition:
            background 0.3s ease,
            color 0.3s ease,
            transform 0.2s ease;
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
          from {
            opacity: 0;
            transform:
              translateY(15px);
          }

          to {
            opacity: 1;
            transform:
              translateY(0);
          }
        }

        .fade-in-up {
          animation:
            fadeInUp 0.5s ease
            forwards;
        }

        .stagger-item {
          opacity: 0;
          animation:
            fadeInUp 0.4s ease
            forwards;
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
          border:
            2px dashed
            rgba(255,255,255,0.2);
          background-color: #1a1f2c;
          padding: 1rem;
          border-radius: 14px;
          box-shadow:
            0px 20px 25px -15px
            rgba(0,0,0,0.5);
          transition:
            all 0.2s ease;
        }

        .custum-file-upload:hover {
          border-color: #38bdf8;
          background-color: #1f2536;
        }

        .custum-file-upload
          .icon
          svg {
          height: 45px;
          fill: #38bdf8;
        }

        .custum-file-upload
          .text
          span {
          font-weight: 600;
          font-size: 13px;
          color: #cbd5e1;
          text-align: center;
        }

        .custum-file-upload
          input {
          display: none;
        }

        .button-main {
          --black-700:
            hsla(0 0% 12% / 1);
          --border_radius: 17px;
          --transtion:
            0.3s ease-in-out;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center;
          padding: 1rem 1.5rem;
          background-color:
            transparent;
          border: none;
          border-radius:
            var(--border_radius);
          transform:
            scale(
              calc(
                1 +
                (
                  var(
                    --active,
                    0
                  ) *
                  0.03
                )
              )
            );
          transition:
            transform
            var(--transtion);
        }

        .button-main::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform:
            translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-color:
            var(--black-700);
          border-radius:
            var(--border_radius);
          box-shadow:
            inset 0 0.5px
              hsl(0, 100%, 99%),
            inset 0 -1px 2px 0
              hsl(0, 0%, 99%),
            0px 4px 12px -4px
              hsla(
                0 100% 200% /
                calc(
                  1 -
                  var(
                    --active,
                    0
                  )
                )
              ),
            0 0 0
              calc(
                var(--active, 0) *
                0.375rem
              )
              hsl(
                260 97% 50% /
                0.75
              );
          transition:
            all var(--transtion);
          z-index: 0;
        }

        .button-main::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform:
            translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-color:
            hsla(
              260 97% 61% /
              0.75
            );
          background-image:
            radial-gradient(
              at 51% 89%,
              hsla(
                266,
                45%,
                74%,
                1
              )
                0px,
              transparent 50%
            ),
            radial-gradient(
              at 100% 100%,
              hsla(
                266,
                36%,
                60%,
                1
              )
                0px,
              transparent 50%
            ),
            radial-gradient(
              at 22% 91%,
              hsla(
                266,
                36%,
                60%,
                1
              )
                0px,
              transparent 50%
            );
          background-position: top;
          opacity:
            var(--active, 0);
          border-radius:
            var(--border_radius);
          transition:
            opacity
            var(--transtion);
          z-index: 2;
        }

        .button-main:is(
            :hover,
            :focus-visible
          ) {
          --active: 1;
        }

        .button-main
          .text_button {
          position: relative;
          z-index: 10;
          background-image:
            linear-gradient(
              90deg,
              rgb(255, 250, 250)
                0%,
              hsla(
                0 0% 100% /
                var(--active, 0)
              )
                120%
            );
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
          font-family: "Inter",
            sans-serif;
          font-size: 1.2em;
          font-weight: 300;
          color: white;
          border-radius: 50%;
          background-color:
            transparent;
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
          background-color:
            transparent;
          animation:
            loader-rotate 2s
            linear infinite;
          z-index: 0;
        }

        @keyframes loader-rotate {
          0% {
            transform:
              rotate(90deg);
            box-shadow:
              0 10px 20px 0
                #fff inset,
              0 20px 30px 0
                #ad5fff inset,
              0 60px 60px 0
                #471eec inset;
          }

          50% {
            transform:
              rotate(270deg);
            box-shadow:
              0 10px 20px 0
                #fff inset,
              0 20px 10px 0
                #d60a47 inset,
              0 40px 60px 0
                #311e80 inset;
          }

          100% {
            transform:
              rotate(450deg);
            box-shadow:
              0 10px 20px 0
                #fff inset,
              0 20px 30px 0
                #ad5fff inset,
              0 60px 60px 0
                #471eec inset;
          }
        }

        .loader-letter {
          display: inline-block;
          opacity: 0.4;
          transform:
            translateY(0);
          animation:
            loader-letter-anim
            2s infinite;
          z-index: 1;
          border-radius: 50ch;
          border: none;
        }

        .loader-letter:nth-child(1) {
          animation-delay: 0s;
        }

        .loader-letter:nth-child(2) {
          animation-delay: 0.1s;
        }

        .loader-letter:nth-child(3) {
          animation-delay: 0.2s;
        }

        .loader-letter:nth-child(4) {
          animation-delay: 0.3s;
        }

        .loader-letter:nth-child(5) {
          animation-delay: 0.4s;
        }

        .loader-letter:nth-child(6) {
          animation-delay: 0.5s;
        }

        .loader-letter:nth-child(7) {
          animation-delay: 0.6s;
        }

        .loader-letter:nth-child(8) {
          animation-delay: 0.7s;
        }

        .loader-letter:nth-child(9) {
          animation-delay: 0.8s;
        }

        .loader-letter:nth-child(10) {
          animation-delay: 0.9s;
        }

        @keyframes loader-letter-anim {
          0%,
          100% {
            opacity: 0.4;
            transform:
              translateY(0);
          }

          20% {
            opacity: 1;
            transform:
              scale(1.15);
          }

          40% {
            opacity: 0.7;
            transform:
              translateY(0);
          }
        }
      `}</style>
    </div>
  );
}






























































