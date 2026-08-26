import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { emails, message } = await request.json();

    if (!emails || !emails.length) {
      return NextResponse.json({ error: '발송할 이메일이 없습니다.' }, { status: 400 });
    }

    // 구글 시트 이메일 발송 시뮬레이션 및 로그
    console.log('발송 대상 이메일:', emails);
    console.log('전송할 메시지:', message);

    return NextResponse.json({ 
      success: true, 
      message: `${emails.length}명에게 메일을 성공적으로 발송했습니다.` 
    });
    
  } catch (error) {
    console.error('메일 전송 오류:', error);
    return NextResponse.json({ error: '메일 전송 중 오류가 발생했습니다.' }, { status: 500 });
  }
}