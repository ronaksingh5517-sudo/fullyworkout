"use client";
import { useState, useRef } from "react";

export default function CameraCapture({ onCapture }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      // Check browser support first.
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Camera is not supported by this browser. Please use Chrome, Safari, or Edge."
        );
        return;
      }

      // Start only after permission/request succeeds.
      // First try the rear/environment camera.
      let stream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch (firstError) {
        // Some devices/browsers do not accept the facingMode constraint.
        // Fall back to any available camera.
        if (
          firstError?.name === "OverconstrainedError" ||
          firstError?.name === "NotFoundError"
        ) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        } else {
          throw firstError;
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn("Video autoplay warning:", playError);
        }
      }

      setIsStreaming(true);
    } catch (err) {
      console.error("Camera access error:", err);

      let message =
        "Unable to open the camera. Please check your browser camera permission.";

      switch (err?.name) {
        case "NotAllowedError":
        case "PermissionDeniedError":
          message =
            "Camera permission is blocked. Please allow camera access for this website and try again.";
          break;

        case "NotFoundError":
        case "DevicesNotFoundError":
          message =
            "No camera was found on this device.";
          break;

        case "NotReadableError":
        case "TrackStartError":
          message =
            "The camera is currently being used by another app or browser tab. Close it and try again.";
          break;

        case "SecurityError":
          message =
            "The browser blocked camera access for security reasons. Open the site on HTTPS and try again.";
          break;

        case "AbortError":
          message =
            "Camera startup was interrupted. Please try again.";
          break;

        default:
          message =
            `Camera could not be opened (${err?.name || "Unknown error"}). Please try again.`;
      }

      alert(message);
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