"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(8px)",
      color: "#ffffff",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 9999,
      fontSize: "14px",
      fontFamily: "sans-serif",
    }}>
      <div>
        본 사이트는 서비스 개선과 방문자 통계 분석을 위해 쿠키를 사용합니다.
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleDecline}
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          거부
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          허용
        </button>
      </div>
    </div>
  );
}