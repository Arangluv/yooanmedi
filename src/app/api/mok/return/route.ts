import { NextResponse } from 'next/server';

type PhoneVerificationReturnPayload = {
  resultCode: string;
  resultMsg: string;
  encryptMOKKeyToken: string;
};

export type PhoneVerificationApprovalPayload = {
  resultCode: string;
  resultMsg: string;
  serviceId: string;
  encryptMOKResult: string;
};

export async function POST(request: Request) {
  try {
    // 1) URL decode
    const data = await request.text();
    const value = new URLSearchParams(data).get('data');

    if (!value) {
      return NextResponse.json(
        { message: '휴대폰 인증 결과를 받아오는데 실패했습니다' },
        { status: 400 },
      );
    }

    const decoded = decodeURIComponent(value);

    // JSON 파싱
    const payload: PhoneVerificationReturnPayload = JSON.parse(decoded);

    // 파싱정보 검증
    const approvalData = await fetch(process.env.MOK_APPROVAL_URL as string, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const approvalResponse: PhoneVerificationApprovalPayload = await approvalData.json();

    if (approvalResponse.resultCode !== '2000' || !approvalResponse.encryptMOKResult) {
      return NextResponse.json(
        { message: '휴대폰 인증 결과를 검증하는데 실패했습니다' },
        { status: 400 },
      );
    }

    return NextResponse.json(approvalResponse);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: '휴대폰 인증 결과를 받아오는데 실패했습니다' },
      { status: 500 },
    );
  }
}
