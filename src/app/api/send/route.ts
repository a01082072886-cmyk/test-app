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

    // 1. 구글 시트 연동 및 데이터 저장
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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

    // 2. Resend 수신 확인 메일 발송 (법적 수신거부 안내 포함)
    await resend.emails.send({
      from: 'newsletter@apinez.com',
      to: email,
      subject: '[apinez] 뉴스레터 구독 신청이 완료되었습니다.',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>뉴스레터 구독 신청이 완료되었습니다!</h2>
          <p>새로운 소식과 업데이트 사항을 가장 먼저 알려드릴게요.</p>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <footer style="font-size: 12px; color: #888; margin-top: 20px;">
            <p>본 메일은 수신 동의를 바탕으로 발송된 발신 전용 메일입니다.</p>
            <p>수신을 원치 않으시면 <a href="https://apinez.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #666;">[수신 거부 / Unsubscribe]</a>를 클릭해 주세요.</p>
            <p>© apinez. All rights reserved.</p>
          </footer>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: '구독 신청이 완료되었습니다.' });
  } catch (error) {
    console.error('구독 처리 오류:', error);
    return NextResponse.json({ error: '구독 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}