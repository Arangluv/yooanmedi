import { NextRequest, NextResponse } from 'next/server';
import { Logger } from '@/shared/infrastructure';
import { PGPaymentCommand } from '@/features/payments/model/command/pg-payment-command';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const manager = new PGPaymentCommand(formData);
    const result = await manager.execute();

    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'success');
    url.searchParams.set('approvalDate', result.approvalDate.toString());
    url.searchParams.set('amount', result.amount.toString());
    url.searchParams.set('shopOrderNo', result.shopOrderNo);

    return NextResponse.redirect(url, { status: 302 });
  } catch (error: any) {
    Logger.error(error);

    // 리다이렉트 -> TODO: searchParams를 set하는 방식에 대해 고민이 필요합니다
    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'error');
    url.searchParams.set('code', error.cause?.code || 'unknown');
    return NextResponse.redirect(url, { status: 302 });
  }
}
