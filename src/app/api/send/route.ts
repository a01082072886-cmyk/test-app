import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '올바른 이메일 주소를 입력해 주세요.' }, { status: 400 });
    }

   // 1. 구글 시트 연동 및 데이터 저장 (JSON 전체 통째로 읽기)
let credentials;
try {
  // Vercel 환경변수에 넣은 JSON 문자열을 객체로 변환
  credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');
} catch (e) {
  credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  };
}

const serviceAccountAuth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    await doc.loadInfo();

    // 'Subscribers' 탭 선택
    const sheet = doc.sheetsByTitle['Subscribers'];
    
    // 이메일과 현재 일시 저장
    await sheet.addRow({
      Email: email,
      Date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    });

    // 1. 구독자에게 보내는 환영 메일
await resend.emails.send({
  from: 'newsletter@apinez.com',
  to: email, // 구독자 이메일
  subject: 'Apinez 뉴스레터 구독을 환영합니다!',
  html: `<p>뉴스레터를 구독해주셔서 감사합니다.</p>`,
});

// 2. 💡 관리자(회원님)에게 보내는 알림 메일 (이 부분을 추가하세요!)
await resend.emails.send({
  from: 'newsletter@apinez.com',
  to: '본인의_실제_이메일@gmail.com', // 👈 알림을 받을 본인 이메일 주소 입력
  subject: '[알림] 새로운 구독자가 등록되었습니다!',
  html: `<p>새로운 구독자 이메일이 등록되었습니다: <b>${email}</b></p>`,
});