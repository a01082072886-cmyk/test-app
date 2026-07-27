import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email], // 테스트 시에는 가입한 본인 이메일(joshuakim352@icloud.com) 입력
      subject: '구독해 주셔서 감사합니다!',
      html: '<p>뉴스레터 구독 신청이 완료되었습니다.</p>',
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}