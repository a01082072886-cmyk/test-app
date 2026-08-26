import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              background-color: #f5f5f7;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 40px 0;
              color: #000000;
            }
            .email-card {
              max-width: 480px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 24px;
              padding: 40px;
              border: 1px solid #e5e7eb;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
              text-align: center;
            }
            .logo-container {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-bottom: 24px;
            }
            .logo-text {
              font-size: 20px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            h1 {
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 12px;
              letter-spacing: -0.5px;
            }
            p {
              font-size: 14px;
              color: #666666;
              line-height: 1.6;
              margin-bottom: 32px;
            }
            .footer {
              font-size: 12px;
              color: #999999;
              border-top: 1px solid #f0f0f0;
              padding-top: 20px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="email-card">
            <!-- 사이트 로고 아이콘과 A PINE Z 텍스트 조합 -->
            <div class="logo-container">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 60 30 C 44 38, 41 46, 47 49 C 53 52, 56 42, 51 35 C 44 24, 30 30, 32 45 C 34 60, 52 66, 62 54 C 70 44, 65 28, 52 22 C 32 14, 16 30, 18 48 C 20 68, 48 80, 72 60"
                  stroke="#000000" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <div class="logo-text">A PINE Z</div>
            </div>

            <h1>구독해 주셔서 감사합니다</h1>
            <p>
              안녕하세요!<br>
              A PINE Z의 최신 소식과 아트웍 업데이트를<br>
              가장 먼저 전해드리겠습니다.
            </p>
            <div class="footer">
              © A PINE Z. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: 'A PINE Z <newsletter@apinez.com>',
      to: [email],
      subject: '[A PINE Z] 뉴스레터 구독이 완료되었습니다.',
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('메일 전송 오류:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}