"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AICoachPage() {
  const { data: session } = useSession();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Friend");

  // ================================
  // USER PLAN & CHAT LIMIT
  // ================================
  const [userPlan, setUserPlan] = useState("Loading plan...");
  const [remainingChats, setRemainingChats] = useState(0);

  const [recentChats, setRecentChats] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const chatEndRef = useRef(null);

  // ================================
  // CHAT DISPLAY HELPER
  // ================================
  const getRemainingChatsText = () => {
    if (
      remainingChats === "Unlimited" ||
      remainingChats === Infinity
    ) {
      return "Unlimited";
    }

    return remainingChats;
  };

  // ================================
  // FETCH USER PLAN
  // ================================
  useEffect(() => {
    setIsLoaded(true);

    const savedName =
      session?.user?.name ||
      localStorage.getItem("aurafit_user_name") ||
      "Bro";

    setUserName(savedName);

    const fetchUserPlanAndHistory = async () => {
      try {
        const userEmail = session?.user?.email;

        if (!userEmail) {
          setUserPlan("Free Plan");
          setRemainingChats(1);
          return;
        }

        // Central entitlement system — same source used by the other
        // feature pages. Daily AI Chat limits reset at 12:00 AM IST.
        const res = await fetch("/api/user/entitlements", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data && data.success) {
          const planName =
            data?.planDetails?.name ||
            (data?.plan
              ? `${String(data.plan).charAt(0).toUpperCase()}${String(
                  data.plan
                ).slice(1)} Plan`
              : "Free Plan");

          setUserPlan(planName);

          setRemainingChats(
            typeof data?.remaining?.aiChats === "number"
              ? data.remaining.aiChats
              : 0
          );
        } else {
          setUserPlan("Free Plan");
          setRemainingChats(0);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);

        setUserPlan("Free Plan");
        setRemainingChats(1);
      }
    };

    fetchUserPlanAndHistory();
  }, [session]);

  // ================================
  // AUTO SCROLL
  // ================================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, isTyping]);

  // ================================
  // INPUT
  // ================================
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // ================================
  // NEW CHAT
  // ================================
  const handleNewChat = () => {
    setMessages([]);
  };

  // ================================
  // SEND MESSAGE
  // ================================
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setInput("");

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        text: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          userName,
          email: session?.user?.email || "",
        }),
      });

      const data = await res.json();

      // ================================
      // DAILY CHAT LIMIT REACHED
      // ================================
      if (res.status === 429) {
        setIsTyping(false);
        setLoading(false);

        if (data?.usage) {
          setRemainingChats(
            typeof data.usage.remaining === "number"
              ? data.usage.remaining
              : 0
          );
        } else {
          setRemainingChats(0);
        }

        alert(
          data.error ||
            "Today's AI Coach limit is reached. Your chats will reset at 12:00 AM IST."
        );
        return;
      }

      if (res.status === 401 || res.status === 403) {
        setIsTyping(false);
        setLoading(false);

        alert(data.error || "Please sign in to use AI Coach.");
        return;
      }

      // ================================
      // AI RESPONSE
      // ================================
      const aiReply =
        data.reply ||
        "Sorry, I am unable to process that right now.";

      setIsTyping(false);
      setLoading(false);

      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant",
          text: aiReply,
        },
      ];

      setMessages(finalMessages);

      // ================================
      // UPDATE REMAINING DAILY CHATS
      // ================================
      if (data?.usage) {
        if (typeof data.usage.remaining === "number") {
          setRemainingChats(data.usage.remaining);
        }
      } else if (typeof data?.remainingChats === "number") {
        // Backward-compatible fallback for an older API response.
        setRemainingChats(data.remainingChats);
      }
    } catch (err) {
      console.error(err);

      setIsTyping(false);
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Network error. Please try again.",
        },
      ]);
    }
  };

  // ================================
  // DISPLAY VALUE
  // ================================
  const remainingChatsText = getRemainingChatsText();

  return (
    <main
      aria-label="Brad AI Fitness Coach"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#080a0e",
        color: "#ffffff",
        display: "flex",
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
        boxSizing: "border-box",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.25s ease-in-out",
      }}
    >
      {/* =========================================
          SIDEBAR
      ========================================= */}

      <nav
        aria-label="Sidebar Menu"
        style={{
          width: "280px",
          height: "100%",
          background: "#0b0f17",
          borderRight:
            "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease",
          transform: sidebarOpen
            ? "translateX(0)"
            : "translateX(-100%)",
          zIndex: 50,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        {/* Sidebar Header */}

        <div
          style={{
            padding: "16px",
            borderBottom:
              "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: "16px",
              color: "#38bdf8",
            }}
          >
            FullyWorkout Menu
          </span>

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Menu"
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* New Chat */}

        <div
          style={{
            padding: "16px 16px 0 16px",
          }}
        >
          <button
            onClick={handleNewChat}
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg, #a67dff, #7a45ff)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>+ New Chat</span>
          </button>
        </div>

        {/* =========================================
            PLAN STATUS
        ========================================= */}

        <div
          style={{
            margin: "16px",
            padding: "12px",
            background:
              "rgba(56, 189, 248, 0.08)",
            border:
              "1px solid rgba(56, 189, 248, 0.2)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            ACTIVE PLAN:
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#38bdf8",
              fontWeight: 800,
              marginTop: "2px",
            }}
          >
            {userPlan}
          </div>

          {/* FIXED: No "Today" */}

          <div
            style={{
              fontSize: "12px",
              color: "#4ade80",
              marginTop: "4px",
            }}
          >
            Remaining Chats:{" "}
            <b>{remainingChatsText}</b>
          </div>

          <Link
            href="/pricing"
            style={{
              display: "inline-block",
              marginTop: "8px",
              fontSize: "12px",
              color: "#4ade80",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Upgrade Plan ⚡
          </Link>
        </div>

        {/* App Features */}

        <div
          style={{
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderBottom:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              color: "#64748b",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            App Features
          </div>

          <Link
            href="/dashboard"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "15px",
              padding: "8px 12px",
              borderRadius: "8px",
              background:
                "rgba(255,255,255,0.03)",
            }}
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/food-scanner"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "15px",
              padding: "8px 12px",
              borderRadius: "8px",
              background:
                "rgba(255,255,255,0.03)",
            }}
          >
            📸 Vision Food Scanner
          </Link>

          <Link
            href="/body-scan"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "15px",
              padding: "8px 12px",
              borderRadius: "8px",
              background:
                "rgba(255,255,255,0.03)",
            }}
          >
            🧍 Body Posture Scanner
          </Link>
        </div>
      </nav>

      {/* Sidebar Overlay */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* =========================================
          MAIN CHAT
      ========================================= */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* =========================================
            HEADER
        ========================================= */}

        <header
          style={{
            padding: "12px 20px",
            borderBottom:
              "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns:
              "auto 1fr auto",
            alignItems: "center",
            background:
              "rgba(18,22,34,0.85)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Menu"
            style={{
              background:
                "rgba(255,255,255,0.08)",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              justifySelf: "start",
            }}
          >
            ☰
          </button>

          <div
            style={{
              textAlign: "center",
              justifySelf: "center",
              position: "relative",
              left: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "25px",
                fontWeight: 800,
                margin: 0,
              }}
            >
              Brad
            </h1>

            <span
              style={{
                fontSize: "13px",
                color: isTyping
                  ? "#4ade80"
                  : "#94a3b8",
              }}
            >
              {isTyping
                ? "typing..."
                : `Status: ${userPlan} | Left: ${remainingChatsText}`}
            </span>
          </div>

          <Link
            href="/dashboard"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
              justifySelf: "end",
            }}
          >
            Dashboard →
          </Link>
        </header>

        {/* =========================================
            MESSAGE AREA
        ========================================= */}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding:
              "24px 16px 80px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxSizing: "border-box",
            alignItems: "center",
            justifyContent:
              messages.length === 0
                ? "center"
                : "flex-start",
          }}
        >
          {messages.length === 0 ? (
            <div
              className="welcome-banner-anim"
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "12px",
                }}
              >
                👋
              </div>

              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 0 8px 0",
                }}
              >
                What can I help, {userName}?
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  color: "#94a3b8",
                  maxWidth: "400px",
                  margin: "0 auto",
                  lineHeight: "1.5",
                }}
              >
                Direct, crisp fitness and diet
                coaching by Brad. Ask your query!
              </p>

              {/* FIXED: No "today" */}

              <div
                style={{
                  marginTop: "16px",
                  fontSize: "12px",
                  color: "#38bdf8",
                  background:
                    "rgba(56, 189, 248, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  display: "inline-block",
                }}
              >
                Active Package: {userPlan} (
                {remainingChatsText} chats left)
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: "750px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {messages.map((msg, idx) => {
                const isUser =
                  msg.role === "user";

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: isUser
                        ? "flex-end"
                        : "flex-start",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "85%",
                        background: isUser
                          ? "linear-gradient(135deg, #a67dff, #7a45ff)"
                          : "rgba(18,22,34,0.9)",
                        color: "#ffffff",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        fontSize: "16.5px",
                        lineHeight: "1.6",
                        border: isUser
                          ? "none"
                          : "1px solid rgba(255,255,255,0.08)",
                        boxShadow: isUser
                          ? "0 4px 12px rgba(122,69,255,0.3)"
                          : "0 4px 16px rgba(0,0,0,0.4)",
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "6px 0",
                  }}
                >
                  <div
                    style={{
                      background:
                        "rgba(18,22,34,0.9)",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#4ade80",
                        fontWeight: 600,
                      }}
                    >
                      Brad is typing
                    </span>

                    <div className="typing-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* =========================================
            INPUT BAR
        ========================================= */}

        <div
          style={{
            flexShrink: 0,
            width: "100%",
            padding:
              "12px 16px 65px 16px",
            background:
              "rgba(8,10,14,0.98)",
            borderTop:
              "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            zIndex: 10,
          }}
        >
          <form
            onSubmit={sendMessage}
            className="pb-ai-input-wrap"
            style={{
              width: "100%",
              maxWidth: "700px",
            }}
          >
            <input
              type="text"
              aria-label="Ask Brad anything"
              className="pb-ai-input"
              placeholder={`Ask Brad anything (${remainingChatsText} chats left)...`}
              value={input}
              onChange={handleInputChange}
            />

            <button
              type="submit"
              aria-label="Send Message"
              className="pb-ai-input-btn"
              style={{
                padding: "12px 16px",
                minWidth: "48px",
                height: "48px",
                cursor: "pointer",
              }}
            >
              <span
                className="pb-ai-sparkle"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                ↑
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* =========================================
          GLOBAL CSS
      ========================================= */}

      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .welcome-banner-anim {
          animation: fadeInScale 0.4s ease-out
            forwards;
        }

        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-dots .dot {
          width: 6px;
          height: 6px;
          background-color: #4ade80;
          border-radius: 50%;
          animation: bounce 1.4s infinite
            ease-in-out both;
        }

        .typing-dots .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-dots .dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }

          40% {
            transform: scale(1);
          }
        }

        .pb-ai-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 14px;
          border-radius: 999px;
          background:
            linear-gradient(
              180deg,
              rgba(166, 125, 255, 0.18) 0%,
              rgba(122, 69, 255, 0.12) 100%
            );
          backdrop-filter: blur(14px);
          box-shadow:
            0 0 0 4px
              rgba(125, 71, 255, 0.08),
            0 0 24px
              rgba(98, 43, 255, 0.14),
            inset 0 0 6px
              rgba(255, 255, 255, 0.1);
          overflow: hidden;
          isolation: isolate;
        }

        .pb-ai-input {
          position: relative;
          z-index: 3;
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 10px 12px;
          color: #ffffff;
          font-size: 17.5px;
        }

        .pb-ai-input::placeholder {
          color:
            rgba(255, 255, 255, 0.55);
        }

        .pb-ai-input-btn {
          position: relative;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 999px;
          color: #fff;
          background:
            linear-gradient(
              180deg,
              #a67dff 0%,
              #7a45ff 45%,
              #5d24ff 100%
            );
          box-shadow:
            0 0 0 3px
              rgba(125, 71, 255, 0.1),
            0 5px 12px
              rgba(98, 43, 255, 0.2),
            inset 0 2px 8px
              rgba(255, 255, 255, 0.16);
          transition:
            transform 0.2s ease;
        }

        .pb-ai-input-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </main>
  );
}