import { NextRequest, NextResponse } from 'next/server';

import {
  registerResponseSchema,
  registerResultSchema,
  paymentsApproval,
} from '@/features/payments';
import { transformOrderListToInventory } from '@/entities/inventory';
import {
  createUsePointTransaction,
  createEarnPointTransaction,
  getPointWhenUsingCard,
} from '@/entities/point';
import { createOrder } from '@/entities/order';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import {
  createOrderProduct,
  CreateOrderProductDto,
  ORDER_PRODUCT_STATUS,
} from '@/entities/order-product';
import {
  createRecentPurchasedHistory,
  CreateRecentPurchasedHistoryDto,
} from '@/entities/recent-purchased-history';
import { createPayment } from '@/entities/payment';
import type { CreatePaymentDto } from '@/entities/payment';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { buildCreateCreditCardOrderDto } from '@/features/payments/lib/build-payments-dto';
import { OrderProductsManager } from '@/features/payments/lib/process-order-products';

import { PGPaymentManager } from '@/features/payments/model/manager/pg-payment-manager';

export async function POST(request: NextRequest) {
  // const payload = await getPayload();
  // const dbTransactionID = await payload.db.beginTransaction();

  try {
    // if (!dbTransactionID) {
    //   throw new Error('트랜잭션 아이디를 가져오는데 문제가 발생했습니다');
    // }

    const formData = await request.formData();
    const registerResult = PGPaymentManager.validatePaymentRegister(formData);

    const paymentContext = PGPaymentManager.createInitialContext(registerResult);
    const paymentManager = await PGPaymentManager.create(paymentContext);

    // step 1. 결제승인 요청
    const approvalResult = await paymentManager.approvePayment();
    paymentManager.applyApprovalResultToContext(approvalResult);

    // step 2. 주문 생성
    const order = await paymentManager.createOrder();
    paymentManager.applyOrderIdToContext(order.id);

    /**
     * step 3. side effect 처리
     * side effect: 주문 상품 생성, 구매 히스토리 생성, 사용 포인트 차감, 구매 포인트 적립
     */
    await paymentManager.processOrderSideEffects();

    // step 4. 결제 내역 생성
    await paymentManager.createPaymentHistory();

    // 트랜잭션 커밋 -> TODO:: 트랜잭션 설정이 필요합니다
    // await payload.db.commitTransaction(dbTransactionID as string);

    // // 리다이렉트
    // const url = request.nextUrl.clone();
    // url.pathname = '/order/payments/popup-callback';
    // url.searchParams.set('status', 'success');
    // url.searchParams.set('approvalDate', approveData.paymentInfo.approvalDate);
    // url.searchParams.set('amount', approveData.amount.toString());
    // url.searchParams.set('shopOrderNo', approveData.shopOrderNo);
    // return NextResponse.redirect(url, { status: 302 });

    return NextResponse.json({ message: '결제 처리가 완료되었습니다' }, { status: 200 });
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
