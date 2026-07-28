import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 관리자(나)의 이메일 주소
const ADMIN_EMAIL = 'joshuakim352@icloud.com';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '이메일 주소가 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 구독자에게 환영 메일 전송
    const userEmailResult = await resend.emails.send({
      from: 'newsletter@apinez.com',
      to: email,
      subject: '구독해 주셔서 감사합니다!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>뉴스레터 구독 신청이 완료되었습니다.</h2>
          <p>새로운 소식과 업데이트 사항을 가장 먼저 알려드릴게요!</p>
        </div>
      `,
    });

    // 2. 나(관리자)에게 신규 구독 알림 메일 전송
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ADMIN_EMAIL,
      subject: `[신규 구독자 알림] ${email}님이 구독하셨습니다.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>🎉 새로운 구독자가 등록되었습니다!</h3>
          <p><strong>구독자 이메일:</strong> ${email}</p>
          <p><strong>신청 시간:</strong> ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
        </div>
      `,
    });

    // 3. Resend Contacts(구독자 목록)에 자동으로 저장
    try {
      await resend.contacts.create({
        email: email,
        unsubscribed: false,
      });
    } catch (contactError) {
      console.log('Contacts 등록 과정 중 참고 사항:', contactError);
    }

    return NextResponse.json({ success: true, data: userEmailResult });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: '이메일 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}