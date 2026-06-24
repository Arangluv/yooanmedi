import { NextRequest, NextResponse } from 'next/server';
import { payByPgApi, USER_PAYMENT_CONSTANTS } from '@/features/user-payment';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await payByPgApi(formData);

    const url = request.nextUrl.clone();

    console.log('결제창 닫을때 result');
    console.log(result);

    if (!result.isSuccess) {
      url.pathname = '/order/payments/popup-callback';
      url.searchParams.set('status', USER_PAYMENT_CONSTANTS.status.fail);
      url.searchParams.set('message', result.message);
      return NextResponse.redirect(url, { status: 302 });
    }

    const { approvalDate, amount, shopOrderNo } = result.data;
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', USER_PAYMENT_CONSTANTS.status.success);
    url.searchParams.set('approvalDate', approvalDate);
    url.searchParams.set('amount', amount.toString());
    url.searchParams.set('shopOrderNo', shopOrderNo);
    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', USER_PAYMENT_CONSTANTS.status.fail);
    url.searchParams.set('message', '결제요청을 처리하는데 문제가 발생했습니다');
    return NextResponse.redirect(url, { status: 302 });
  }
}
