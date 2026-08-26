import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A PINE Z",
  description: "A PINE Z official website",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children} {/* <- 이 페이지 본문들 아래쪽에 */}
        
        <footer style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
  <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>24/7</p>
  <div style={{ fontSize: '15px', color: '#000', fontWeight: 'bold' }}>
    <a href="/cookie" style={{ margin: '0 15px', textDecoration: 'none', color: 'inherit' }}>쿠키 정책</a>
    <a href="/privacy" style={{ margin: '0 15px', textDecoration: 'none', color: 'inherit' }}>개인 정보 처리 방침</a>
    <a href="/accessibility" style={{ margin: '0 15px', textDecoration: 'none', color: 'inherit' }}>접근성</a>
  </div>
</footer>
      </body>
    </html>
  )
}
