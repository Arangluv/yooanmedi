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

export async function POST(request: NextRequest) {
  // const payload = await getPayload();
  // const dbTransactionID = await payload.db.beginTransaction();

  try {
    // if (!dbTransactionID) {
    //   throw new Error('트랜잭션 아이디를 가져오는데 문제가 발생했습니다');
    // }

    let data = {} as Record<string, string>;
    const formData = await request.formData();
    formData.forEach((value: any, key: string) => {
      data[key as string] = value;
    });

    const registerResponse = registerResponseSchema.parse(data);
    if (registerResponse.resCd !== '0000') {
      throw new Error('결제 등록 요청을 처리하는데 문제가 발생했습니다', {
        cause: { code: registerResponse.resCd },
      });
    }

    const {
      authorizationId,
      shopOrderNo,
      deliveryRequest,
      orderList,
      usedPoint,
      userId,
      minOrderPrice,
    } = registerResultSchema.parse(data);

    // 결제 승인 요청
    const approveData = await paymentsApproval({
      authorizationId,
      shopOrderNo,
    });

    // 주문 생성
    // const DEFAULT_ORDER_DELIVERY_FEE = 0;
    // const createOrderDto: CreateOrderDto = {
    //   orderStatus: ORDER_STATUS.PREPARING,
    //   flgStatus: FLG_STATUS.INIT_NORMAL,
    //   paymentStatus: PAYMENT_STATUS.COMPLETE,
    //   orderDeliveryFee: DEFAULT_ORDER_DELIVERY_FEE, // 묶음 배송 처리 시 사용하는 필드 -> 고도화 예정
    //   paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    //   user: userId,
    //   orderNo: shopOrderNo,
    //   orderRequest: deliveryRequest,
    //   finalPrice: approveData.amount,
    //   usedPoint: usedPoint,
    // };
    const createOrderDto = buildCreateCreditCardOrderDto({
      user: userId,
      orderNo: shopOrderNo,
      orderRequest: deliveryRequest,
      finalPrice: approveData.amount,
      usedPoint,
    });
    const order = await createOrder({
      dto: createOrderDto,
    });

    // 결제 내역 생성
    const createPaymentDto: CreatePaymentDto = {
      order: order.id,
      amount: approveData.amount,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
      pgCno: approveData.pgCno,
    };
    await createPayment(createPaymentDto);

    const inventory = await transformOrderListToInventory(orderList);
    const deliveryInfoManager = new DeliveryInfoManager(inventory, minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryInfoManager, usedPoint);

    // 주문 상품 생성
    for (let i = 0; i < inventory.length; i++) {
      const inventoryItem = inventory[i];
      const orderProductSubtotal = deliveryInfoManager.getOrderProductSubtotal(inventoryItem);
      const orderProductTotalAmount =
        orderProductSubtotal - pointAllocator.getAllocatedPoint(inventoryItem.product.id);

      const createOrderProductDto: CreateOrderProductDto = {
        order: order.id,
        product: inventoryItem.product.id,
        orderProductStatus: ORDER_PRODUCT_STATUS.PREPARING,
        priceSnapshot: inventoryItem.product.price,
        productNameSnapshot: inventoryItem.product.name,
        totalAmount: orderProductTotalAmount,
        productDeliveryFee: deliveryInfoManager.getOrderProductDeliveryFee(inventoryItem),
        quantity: inventoryItem.quantity,
        cashback_rate: inventoryItem.product.cashback_rate,
        cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
      };

      const orderProduct = await createOrderProduct({
        dto: createOrderProductDto,
      });

      // 히스토리 생성
      const createRecentPurchasedHistoryDto: CreateRecentPurchasedHistoryDto = {
        user: userId,
        product: inventoryItem.product.id,
        quantity: inventoryItem.quantity,
        amount: inventoryItem.product.price,
      };
      await createRecentPurchasedHistory(createRecentPurchasedHistoryDto);

      // 사용 포인트 차감
      if (usedPoint) {
        await createUsePointTransaction({
          userId,
          orderProductId: orderProduct.id,
          amount: pointAllocator.getAllocatedPoint(inventoryItem.product.id),
        });
      }

      // 구매 포인트 적립
      await createEarnPointTransaction({
        userId,
        orderProductId: orderProduct.id,
        amount: getPointWhenUsingCard(inventoryItem.product) * inventoryItem.quantity,
      });
    }

    // 트랜잭션 커밋 -> TODO:: 트랜잭션 설정이 필요합니다
    // await payload.db.commitTransaction(dbTransactionID as string);

    // 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = '/order/payments/popup-callback';
    url.searchParams.set('status', 'success');
    url.searchParams.set('approvalDate', approveData.paymentInfo.approvalDate);
    url.searchParams.set('amount', approveData.amount.toString());
    url.searchParams.set('shopOrderNo', approveData.shopOrderNo);

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
