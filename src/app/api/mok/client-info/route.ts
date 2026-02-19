import { NextRequest, NextResponse } from 'next/server';

import { USAGE_CODE } from '@/features/phone-verification/constants/usage-code';
import { generateClientInfo } from '@/features/phone-verification/lib/generate-client-info';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const usageCode = url.searchParams.get('usageCode');

    if (!usageCode) {
      return NextResponse.json({ message: '사용코드 필드가 없습니다' }, { status: 400 });
    }

    const clientInfo = await generateClientInfo(usageCode as keyof typeof USAGE_CODE);

    // return NextResponse.json(clientInfo);
    return new NextResponse(JSON.stringify(clientInfo), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: 'error' }, { status: 500 });
  }
}
