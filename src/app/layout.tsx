import Script from "next/script";
import { Metadata } from "next";
import CookieBanner from "../components/CookieBanner";

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
        <CookieBanner />
      </body>
    </html>
  );
}