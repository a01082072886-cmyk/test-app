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

    // 1. 구글 시트에 이메일과 가입 날짜 추가하기
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

      const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A:B',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[email, now]],
        },
      });

      console.log('✅ 구글 시트 저장 성공:', response.data);
    } catch (sheetError: any) {
      console.error('❌ 구글 시트 저장 실패 상세 에러:', sheetError.message || sheetError);
    }

    // 2. Resend 메일 발송
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h2>구독해 주셔서 감사합니다!</h2>
          <p>A PINE Z의 최신 소식을 전해드리겠습니다.</p>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'onboarding@resend.dev', // 👉 Resend가 제공하는 테스트 전용 발신자 주소
      to: [email],
      subject: '[A PINE Z] 뉴스레터 구독이 완료되었습니다.',
      html: htmlContent,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('전체 API 에러:', error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}