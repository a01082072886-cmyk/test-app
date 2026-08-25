"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setTimeout(() => {
          setEmail("");
          setSubscribed(false);
          setIsHovered(false);
          setIsFocused(false);
        }, 3000);
      }
    } catch (error) {
      console.error("메일 전송 실패:", error);
    }
  };

  const isOpen = isHovered || isFocused;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", color: "#000000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", width: "100%", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .sticky-header {
          transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease;
        }

        .dropdown-menu {
          transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
        }

        .glass-card {
          transition: transform 0.3s ease, background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .glass-card .icon-wrapper {
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          background-color: rgba(0, 0, 0, 0.45) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2) !important;
        }

        .glass-card:hover .icon-wrapper {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      {/*  상단 고정 바 (홈으로 이동하는 클릭 가능한 로고 적용) */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "48px", backgroundColor: "#f5f5f7", zIndex: 1001, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", cursor: "pointer" }}>
          <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path 
              d="M 50 42 
                 C 44 38, 41 46, 47 49 
                 C 53 52, 56 42, 51 35 
                 C 44 24, 30 30, 32 45 
                 C 34 60, 52 66, 62 54 
                 C 70 44, 66 30, 52 25 
                 C 34 20, 22 34, 24 50 
                 C 26 68, 50 78, 68 70 
                 C 78 64, 80 46, 70 34" 
              stroke="#000000" 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
      
      {/* 1번 섹션: 비디오 위로 뜨는 A PINE Z 글자 + 드롭다운 뉴스레터 */}
      <header 
        className="sticky-header"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          position: "fixed", 
          top: "48px", 
          left: 0,
          right: 0,
          zIndex: 1000, 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          padding: "20px 0", 
          width: "100%",
          backgroundColor: isScrolled || isOpen ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: isScrolled || isOpen ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled || isOpen ? "blur(12px)" : "none",
          borderBottom: isScrolled || isOpen ? "1px solid #e5e7eb" : "1px solid transparent",
        }}
      >
        <h1 
          onClick={() => setIsHovered(!isHovered)}
          style={{ 
            margin: 0, 
            fontFamily: "'Inter', sans-serif", 
            fontSize: "32px", 
            fontWeight: 600, 
            letterSpacing: "-1px", 
            color: isScrolled || isOpen ? "#000000" : "#ffffff", 
            textAlign: "center",
            userSelect: "none",
            cursor: "pointer",
            transition: "color 0.4s ease"
          }}
        >
          A PINE Z
        </h1>

        <div 
          className="dropdown-menu"
          style={{
            marginTop: "16px",
            width: "100%",
            maxWidth: "420px",
            padding: "0 20px",
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
            transform: isOpen ? "translateY(0)" : "translateY(-10px)",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {subscribed ? (
            <div style={{ textAlign: "center", padding: "10px", fontSize: "14px", fontWeight: 600, color: "#10B981" }}>
              ✓ 성공적으로 구독되었습니다! 최신 소식을 보내드릴게요.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px", width: "100%" }}>
              <input
                type="email"
                placeholder="최신 소식을 받을 이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  fontSize: "14px",
                  borderRadius: "20px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "nowrap"
                }}
              >
                구독
              </button>
            </form>
          )}
        </div>
      </header>

      {/* 2번 섹션: 로컬 비디오 루프 */}
      <section style={{ position: "relative", overflow: "hidden", height: "550px", width: "100%", backgroundColor: "#000000", marginTop: "0" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "brightness(0.95) contrast(1.05)",
          }}
        >
          <source src="/forest.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </section>

      {/* 3번 섹션 */}
      <section style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        width: "100%",
        gap: "16px",
        padding: "20px",
        backgroundColor: "#ffffff"
      }}>
        {[
          {
            name: "Apple Music",
            icon: (
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="30" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="4" />
                <circle cx="36" cy="36" r="30" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="188" strokeDashoffset="40" strokeLinecap="round" transform="rotate(-90 36 36)" />
                <path d="M33 43V27l12-2v13" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="30" cy="43" r="3" fill="#FFFFFF" />
                <circle cx="42" cy="41" r="3" fill="#FFFFFF" />
              </svg>
            ),
            url: "https://music.apple.com/kr/album/a-pine-z-single/6789061112",
            isComingSoon: false,
          },
          {
            name: "Shopify",
            icon: (
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="30" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="4" />
                <circle cx="36" cy="36" r="30" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="188" strokeDashoffset="25" strokeLinecap="round" transform="rotate(-90 36 36)" />
                <path d="M30 26l-3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V30l-3-4H30z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="27" y1="30" x2="45" y2="30" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M40 34a4 4 0 0 1-8 0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ),
            url: null,
            isComingSoon: true,
          },
          {
            name: "Instagram",
            icon: (
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="30" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="4" />
                <circle cx="36" cy="36" r="30" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="188" strokeDashoffset="55" strokeLinecap="round" transform="rotate(-90 36 36)" />
                <rect x="27" y="27" width="18" height="18" rx="4.5" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="36" cy="36" r="4" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="41.5" cy="30.5" r="1" fill="#FFFFFF" />
              </svg>
            ),
            url: "https://www.instagram.com/kimnamhyeun/",
            isComingSoon: false,
          },
          {
            name: "YouTube",
            icon: (
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="30" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="4" strokeDasharray="188" strokeDashoffset="15" strokeLinecap="round" transform="rotate(-90 36 36)" />
                <path d="M45.5 31.2a2.3 2.3 0 0 0-1.6-1.6C42.5 29 36 29 36 29s-6.5 0-7.9.6a2.3 2.3 0 0 0-1.6 1.6A24 24 0 0 0 26 36a24 24 0 0 0 .5 4.8 2.3 2.3 0 0 0 1.6 1.6c1.4.6 7.9.6 7.9.6s6.5 0 7.9-.6a2.3 2.3 0 0 0 1.6-1.6A24 24 0 0 0 46 36a24 24 0 0 0-.5-4.8z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <polygon points="34.5,39 39,36 34.5,33" fill="#FFFFFF" />
              </svg>
            ),
            url: "https://www.youtube.com/@joshua_kimnamhyeon",
            isComingSoon: false,
          },
        ].map((item) => {
          const CardTag = item.url ? "a" : "div";
          
          return (
            <CardTag
              key={item.name}
              {...(item.url ? { href: item.url, target: "_blank", rel: "noopener noreferrer" } : {})}
              className="glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa", 
                backdropFilter: "blur(16px)", 
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid #e5e7eb", 
                borderRadius: "28px", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)", 
                padding: "100px 16px",
                textDecoration: "none",
                cursor: item.url ? "pointer" : "default"
              }}
            >
              <div className="icon-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div>{item.icon}</div>
                {item.isComingSoon && (
                  <span style={{ 
                    marginTop: "12px", 
                    color: "#FFFFFF", 
                    fontSize: "12px", 
                    fontWeight: 600, 
                    letterSpacing: "1.5px",
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    COMING SOON
                  </span>
                )}
              </div>
            </CardTag>
          );
        })}
      </section>

      {/* 4번 섹션 */}
      <footer style={{ backgroundColor: "#ffffff", padding: "40px 20px 30px", textAlign: "center", fontSize: "0.875rem", color: "#000000", width: "100%" }}>
        <div style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: "20px", 
          fontWeight: 600, 
          letterSpacing: "2px", 
          marginBottom: "20px",
          color: "#000000"
        }}>
          24/7
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "28px", fontWeight: "600" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>쿠키 정책</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>개인 정보 처리 방침</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>접근성</a>
        </div>
      </footer>
    </div>
  ); 
}