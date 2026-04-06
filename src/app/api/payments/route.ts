import { NextRequest, NextResponse } from 'next/server';
import { PGPaymentManager } from '@/features/payments/model/manager/pg-payment-manager';
import { PGPaymentInitContext } from '@/features/payments/model/schema/payment-context-schema';

export async function POST(request: NextRequest) {
  // const payload = await getPayload();
  // const dbTransactionID = await payload.db.beginTransaction();

  try {
    // if (!dbTransactionID) {
    //   throw new Error('트랜잭션 아이디를 가져오는데 문제가 발생했습니다');
    // }

    const formData = await request.formData();
    const registerResult = PGPaymentManager.validatePaymentRegister(formData);

    const paymentContext = PGPaymentManager.createInitialContext(registerResult); // 초기 context
    const paymentManager: PGPaymentManager<PGPaymentInitContext> =
      await PGPaymentManager.create(paymentContext);

    // step 1. 결제승인 요청
    const approvalResult = await paymentManager.approvePayment();
    paymentManager.applyApprovalResultToContext(approvalResult);

    // step 2. 주문 생성
    const order = await paymentManager.createOrder();
    paymentManager.applyOrderIdToContext(order.id);

    // step 3. 주문 사이드 이펙트 처리
    await paymentManager.processOrderSideEffects();

    // step 4. 결제 내역 생성
    await paymentManager.createPaymentHistory();

    // 트랜잭션 커밋 -> TODO:: 트랜잭션 설정이 필요합니다
    // await payload.db.commitTransaction(dbTransactionID as string);

    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'success');
    url.searchParams.set('approvalDate', paymentManager.getContext().approvalDate.toString());
    url.searchParams.set('amount', paymentManager.getContext().amount.toString());
    url.searchParams.set('shopOrderNo', paymentManager.getContext().shopOrderNo);

    return NextResponse.redirect(url, { status: 302 });
  } catch (error: any) {
    console.log(error);
    // 트랜잭션 롤백
    // await payload.db.rollbackTransaction(dbTransactionID as string);

    // 리다이렉트 -> TODO: searchParams를 set하는 방식에 대해 고민이 필요합니다
    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'error');
    url.searchParams.set('code', error.cause?.code || 'unknown');
    return NextResponse.redirect(url, { status: 302 });
  }
}
