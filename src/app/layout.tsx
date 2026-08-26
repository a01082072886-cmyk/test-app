import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A PINE Z",
  description: "A PINE Z Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구글 애널리틱스 스크립트 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-2ZBCVQS4N0"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2ZBCVQS4N0');
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <CookieBannerWrapper />
      </body>
    </html>
  );
}

// 쿠키 동의 배너 컴포넌트
import { useState, useEffect } from "react";

function CookieBannerWrapper() {
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