import { NextRequest, NextResponse } from 'next/server';
import { PGPaymentManager } from '@/features/payments/model/manager/pg-payment-manager';
import { PGPaymentInitContext } from '@/features/payments/model/schema/payment-context-schema';
import { handleError } from '@/shared/model/errors/handle-error';
import { Logger } from '@/shared/model/logger/logger';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const registerResult = PGPaymentManager.validatePaymentRegister(formData);
    const paymentContext = PGPaymentManager.createInitialContextFromRegisterResult(registerResult);
    const paymentManager: PGPaymentManager<PGPaymentInitContext> =
      await PGPaymentManager.create(paymentContext);

    const result = await paymentManager.execute();

    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'success');
    url.searchParams.set('approvalDate', result.data.approvalDate.toString());
    url.searchParams.set('amount', result.data.amount.toString());
    url.searchParams.set('shopOrderNo', result.data.shopOrderNo);

    return NextResponse.redirect(url, { status: 302 });
  } catch (error: any) {
    // TODO::
    const errorResult = handleError(error);
    console.log(errorResult);
    Logger.error(error);

    // 리다이렉트 -> TODO: searchParams를 set하는 방식에 대해 고민이 필요합니다
    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'error');
    url.searchParams.set('code', error.cause?.code || 'unknown');
    return NextResponse.redirect(url, { status: 302 });
  }
}
