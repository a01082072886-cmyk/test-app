"use client";

import { useState } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 여기에 원하시는 관리자 비밀번호를 설정하세요!
  const ADMIN_PASSWORD = "ehrtnflskfro0421!"; // 나중에 안전한 비밀번호로 변경하세요.

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 틀렸습니다!");
      setPasswordInput("");
    }
  };

  const handleSendNews = async () => {
    if (!confirm("구글 시트의 구독자들에게 업데이트 소식 메일을 전송하시겠습니까?")) return;

    setLoading(true);
    try {
      const response = await fetch("/api/send-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(`실패: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 1. 로그인이 안 되어 있으면 비밀번호 입력창만 보여줌
  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <form onSubmit={handleLogin} style={{ padding: "30px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2>관리자 인증</h2>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>비밀번호를 입력해야 접속할 수 있습니다.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="비밀번호 입력"
            style={{ padding: "10px", width: "200px", marginRight: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
          />
          <button
            type="submit"
            style={{ padding: "10px 16px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            확인
          </button>
        </form>
      </div>
    );
  }

  // 2. 로그인이 성공하면 관리자 대시보드와 버튼을 보여줌
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>관리자 대시보드</h1>
      <p>구글 시트 구독자들에게 소식을 일괄 전송할 수 있는 안전한 공간입니다.</p>
      
      <button
        onClick={handleSendNews}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#000000",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "발송 중..." : "구글 시트 구독자에게 업데이트 소식 보내기"}
      </button>
    </div>
  );
}