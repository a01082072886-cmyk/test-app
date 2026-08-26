"client"; // 클라이언트 컴포넌트 선언

import { useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  const handleSendNews = async () => {
    if (!confirm("구독자들에게 업데이트 소식 메일을 전송하시겠습니까?")) return;

    setLoading(true);
    try {
      // 만든 API 호출
      const response = await fetch("/api/send-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // 테스트용 이메일 배열 (나중에 구글 시트 데이터로 연결하면 됩니다!)
          emails: ["test1@example.com", "test2@example.com"],
          message: "사이트가 새롭게 업데이트되었습니다!",
        }),
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

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>관리자 대시보드</h1>
      <p>구글 시트 구독자들에게 소식을 일괄 전송할 수 있는 공간입니다.</p>
      
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
        {loading ? "발송 중..." : "구독자에게 업데이트 소식 보내기"}
      </button>
    </div>
  );
}