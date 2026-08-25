import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: '이메일이 없습니다.' }, { status: 400 });
    }

    // 1. 💌 구독자에게 보내는 환영 메일
    await resend.emails.send({
      from: 'newsletter@apinez.com',
      to: email,
      subject: 'Apinez 뉴스레터 구독을 환영합니다!',
      html: `<p>뉴스레터를 구독해주셔서 감사합니다.</p>`,
    });

    // 2. 💡 관리자(회원님)에게 보내는 알림 메일
    await resend.emails.send({
      from: 'newsletter@apinez.com',
      to: '본인의_실제_이메일@gmail.com', // 👈 알림을 받을 본인 이메일 주소 입력
      subject: '[알림] 새로운 구독자가 등록되었습니다!',
      html: `<p>새로운 구독자 이메일이 등록되었습니다: <b>${email}</b></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('메일 전송 실패:', error);
    return NextResponse.json({ error: '메일 전송에 실패했습니다.' }, { status: 500 });
  }
}