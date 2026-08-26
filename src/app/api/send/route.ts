import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { google } from 'googleapis';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. 구글 시트에 구독자 이메일과 가입 날짜 추가하기
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;

      // 한국 시간 기준 가입 날짜 생성
      const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A:B', // 시트의 A열(이메일), B열(날짜)에 추가
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[email, now]],
        },
      });
    } catch (sheetError) {
      console.error('구글 시트 저장 중 오류 발생:', sheetError);
    }

    // 2. Resend 뉴스레터 환영 메일 발송 HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 0; color: #000000; }
            .email-card { max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); text-align: center; }
            .logo-container { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
            .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
            h1 { font-size: 22px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.5px; }
            p { font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 32px; }
            .footer { font-size: 12px; color: #999999; border-top: 1px solid #f0f0f0; padding-top: 20px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="email-card">
            <div class="logo-container">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 60 30 C 44 38, 41 46, 47 49 C 53 52, 56 42, 51 35 C 44 24, 30 30, 32 45 C 34 60, 52 66, 62 54 C 70 44, 65 28, 52 22 C 32 14, 16 30, 18 48 C 20 68, 48 80, 72 60" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
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

    // 3. Resend를 통해 환영 메일 발송 (발신자 주소에 본인 인증 메일 입력)
    const data = await resend.emails.send({
      from: 'A PINE Z <본인의_인증된_개인메일주소>', // 👉 Gravatar 인증한 본인 개인 메일 주소 입력
      to: [email],
      subject: '[A PINE Z] 뉴스레터 구독이 완료되었습니다.',
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('구독 처리 및 메일 전송 오류:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}