"use client";
import { useState, useRef } from "react";

export default function CameraCapture({ onCapture }) {
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
        const file = new File([blob], "meal-capture.jpg", { type: "image/jpeg" });
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
    <div style={{ marginBottom: "16px", textAlign: "center" }}>
      {!isStreaming ? (
        <button
          type="button"
          onClick={startCamera}
          style={{
            width: "100%",
            background: "#38bdf8",
            color: "#0b0f17",
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            fontWeight: 800,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          📷 Open Live Camera
        </button>
      ) : (
        <div style={{ position: "relative", width: "100%" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: "12px", background: "#000" }}
          ></video>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={capturePhoto}
              style={{
                flex: 1,
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Capture Photo 📸
            </button>
            <button
              type="button"
              onClick={stopCamera}
              style={{
                flex: 1,
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
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