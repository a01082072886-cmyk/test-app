import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 구글 시트 CSV 링크 적용 완료
    const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwor68HC9WX2LQnxXC2C34qbkvWVZ5g56XDUdK6LftpptdVDaOoMawQnZebCeJe6wEAApydtPZ20XQ/pub?output=csv';

    // 구글 시트 데이터를 CSV 형식으로 가져오기
    const sheetResponse = await fetch(SHEET_CSV_URL);
    if (!sheetResponse.ok) {
      throw new Error('구글 시트 데이터를 불러오는데 실패했습니다.');
    }
    const csvText = await sheetResponse.text();

    // CSV 텍스트를 파싱하여 이메일 목록 추출
    const rows = csvText.split('\n');
    const emails: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',');
      if (columns && columns.length > 0) {
        const email = columns[0].trim().replace(/^"|"$/g, '');
        if (email && email.includes('@')) {
          emails.push(email);
        }
      }
    }

    if (emails.length === 0) {
      return NextResponse.json({ success: false, message: '구독자 이메일이 없습니다.' }, { status: 400 });
    }

    // 발송 시뮬레이션 및 로그 (구글 시트에서 읽어온 이메일들이 여기에 찍힙니다!)
    console.log('구글 시트에서 불러온 발송 대상 목록:', emails);

    return NextResponse.json({ 
      success: true, 
      message: `구글 시트에서 총 ${emails.length}명의 구독자를 불러와 성공적으로 처리했습니다!`,
      emails 
    });

  } catch (error: any) {
    console.error('API 에러:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}