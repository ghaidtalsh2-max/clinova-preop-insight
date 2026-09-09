import { useEffect, useState } from "react";
import { getAssetPath } from "../utils/assetHelper";

interface SplashScreenProps {
  onFinish: () => void;
  /** مدة الظهور بالميلي ثانية قبل بدء التلاشي */
  displayMs?: number;
  /** مدة التلاشي نفسه بالميلي ثانية */
  fadeMs?: number;
}

export default function SplashScreen({
  onFinish,
  displayMs = 1700,
  fadeMs = 650,
}: SplashScreenProps) {
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Micro-delay to trigger initial smooth entrance
    const mountTimer = setTimeout(() => setMounted(true), 30);
    const fadeTimer = setTimeout(() => setFading(true), displayMs);
    const doneTimer = setTimeout(onFinish, displayMs + fadeMs);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [displayMs, fadeMs, onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(120% 120% at 50% 25%, #ECFDF5 0%, #F0FDFA 35%, #F8FAFC 75%, #F1F5F9 100%)",
        opacity: fading ? 0 : 1,
        transition: `opacity ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: fading ? "none" : "auto",
        zIndex: 99999,
        overflow: "hidden",
        fontFamily: "'Tajawal', 'IBM Plex Sans Arabic', -apple-system, sans-serif",
      }}
    >
      {/* Dynamic Ambient Glowing Color Orbs */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(13, 148, 136, 0.12) 45%, transparent 70%)",
          filter: "blur(60px)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          transition: "transform 1.6s ease-out",
          transformOrigin: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)",
          filter: "blur(50px)",
          top: "32%",
          left: "52%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Content Container with Smooth Scale Animation */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          padding: "2rem",
          transform: mounted && !fading ? "scale(1)" : "scale(0.96)",
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Clinova Logo with Soft Luminous Drop Shadow */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem 1.8rem",
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 18px 45px -12px rgba(13, 148, 136, 0.18), 0 0 0 1px rgba(16, 185, 129, 0.08)",
          }}
        >
          <img
            src={getAssetPath("/logo.png")}
            alt="Clinova — PreOp Insight"
            style={{
              width: "min(380px, 78vw)",
              height: "auto",
              maxHeight: "110px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Elegant Animated Gradient Progress Indicator */}
        <div
          style={{
            width: "160px",
            height: "4px",
            borderRadius: "999px",
            background: "rgba(13, 148, 136, 0.15)",
            overflow: "hidden",
            position: "relative",
            margin: "4px 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: mounted ? "100%" : "15%",
              background: "linear-gradient(90deg, #10B981, #06B6D4, #3B82F6)",
              borderRadius: "999px",
              transition: `width ${displayMs}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
            }}
          />
        </div>

        {/* Hackathon Colorful Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.45rem 1.15rem",
            borderRadius: "9999px",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.14) 100%)",
            border: "1.5px solid rgba(13, 148, 136, 0.28)",
            boxShadow: "0 4px 14px rgba(13, 148, 136, 0.08)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 8px #10B981",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#0F766E",
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            هاكاثون الطائف الصحي 2026 — جامعة الطائف
          </span>
        </div>

        {/* Platform Sub-description in Soft Charcoal */}
        <span
          style={{
            fontSize: "11px",
            color: "#64748B",
            fontWeight: 500,
            letterSpacing: "0.02em",
            textAlign: "center",
          }}
        >
          منصة الذكاء السريري للتقييم قبل الجراحي الموحد
        </span>
      </div>
    </div>
  );
}
