"use client";

import { useState, useEffect } from "react";

export default function InAppBrowserPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check karo ki user TikTok, Instagram, ya Facebook ke in-app browser mein hai
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInstagram = ua.indexOf("Instagram") > -1;
    const isTikTok = ua.indexOf("TikTok") > -1;
    const isFB = ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;

    if (isInstagram || isTikTok || isFB) {
      setShowPopup(true);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>⚠️</div>
        <h3 style={styles.title}>Open in External Browser</h3>
        <p style={styles.desc}>
          You are currently viewing this page inside a social media app browser. For secure login and full features, please tap the <b>3 dots (...)</b> in the top right corner and select <b>"Open in Chrome"</b> or <b>"Open in Safari"</b>.
        </p>
        <button 
          onClick={() => setShowPopup(false)} 
          style={styles.button}
        >
          Got it, I understand
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(8px)",
    zIndex: 99999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  modal: {
    backgroundColor: "#121622",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    borderRadius: "1.25rem",
    padding: "24px 20px",
    maxWidth: "360px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
  },
  icon: {
    fontSize: "36px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#f87171",
  },
  desc: {
    fontSize: "13.5px",
    color: "#94a3b8",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "0.75rem",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
  },
};