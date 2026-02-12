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
import { ORDER_STATUS, createOrder } from '@/entities/order';
import { type CreateOrderDto } from '@/entities/order';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price';
import { PAYMENTS_METHOD } from '@/entities/order';
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
import { PointUseEstimator } from '@/entities/point/lib/use/point-use-estimator';

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
    const DEFAULT_ORDER_DELIVERY_FEE = 0;
    const createOrderDto: CreateOrderDto = {
      user: userId,
      orderNo: shopOrderNo,
      orderStatus: ORDER_STATUS.PREPARING,
      orderRequest: deliveryRequest,
      finalPrice: approveData.amount,
      orderDeliveryFee: DEFAULT_ORDER_DELIVERY_FEE, // 묶음 배송 처리 시 사용하는 필드 -> 고도화 예정
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
      usedPoint: usedPoint,
    };
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

    // 주문 상품 생성
    const inventory = await transformOrderListToInventory(orderList);
    const totalPriceWithoutDeliveryFee = inventory.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    const freeDeliveryFlg = totalPriceWithoutDeliveryFee >= minOrderPrice;
    const pointUseEstimator = new PointUseEstimator(inventory, usedPoint, freeDeliveryFlg);

    for (let i = 0; i < inventory.length; i++) {
      const inventoryItem = inventory[i];

      let totalProductAmount = inventoryItem.product.price * inventoryItem.quantity;
      if (usedPoint) {
        totalProductAmount -= pointUseEstimator.getUsedPoint(inventoryItem.product.id);
      }

      const productDeliveryFee = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });
      // 주문 상품 생성
      const createOrderProductDto: CreateOrderProductDto = {
        product: inventoryItem.product.id,
        order: order.id,
        orderProductStatus: ORDER_PRODUCT_STATUS.ORDERED,
        priceSnapshot: inventoryItem.product.price,
        productNameSnapshot: inventoryItem.product.name,
        productDeliveryFee: productDeliveryFee,
        quantity: inventoryItem.quantity,
        totalAmount: totalProductAmount,
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
          amount: pointUseEstimator.getUsedPoint(inventoryItem.product.id),
        });
      }

      // 구매 포인트 적립
      await createEarnPointTransaction({
        userId,
        orderProductId: orderProduct.id,
        amount: getPointWhenUsingCard(inventoryItem.product),
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
