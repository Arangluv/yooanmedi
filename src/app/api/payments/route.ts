import { NextRequest, NextResponse } from 'next/server';

import {
  registerResponseSchema,
  registerResultSchema,
  paymentsApproval,
} from '@/features/payments';
import { transformOrderListToInventory } from '@/entities/inventory';
import {
  getUsedPointListCalculatedWeight,
  createUsePointTransaction,
  createEarnPointTransaction,
  getPointWhenUsingCard,
} from '@/entities/point';
import { type CreateOrderDto } from '@/entities/order';
import { ORDER_STATUS, createOrder } from '@/entities/order';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price';
import { getPayload } from '@/shared';

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
      paymentsMethod,
      minOrderPrice,
    } = registerResultSchema.parse(data);

    const approveData = await paymentsApproval({
      authorizationId,
      shopOrderNo,
    });

    const inventory = await transformOrderListToInventory(orderList);
    const totalPriceWithoutDeliveryFee = inventory.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    const freeDeliveryFlg = totalPriceWithoutDeliveryFee >= minOrderPrice;
    const pointList = getUsedPointListCalculatedWeight({ inventory, usedPoint }); // TODO :: 변수명 변경이 필요합니다

    for (let i = 0; i < inventory.length; i++) {
      const inventoryItem = inventory[i];

      const productDeliveryFee = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });

      const orderDto = {
        user: userId,
        product: inventoryItem.product.id,
        quantity: inventoryItem.quantity,
        price: inventoryItem.product.price,
        cashback_rate: inventoryItem.product.cashback_rate,
        cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
        delivery_fee: productDeliveryFee,
        pgCno: approveData.pgCno,
        orderNo: shopOrderNo,
        paymentsMethod: paymentsMethod,
        orderCreatedAt: approveData.paymentInfo.approvalDate,
        orderStatus: ORDER_STATUS.PREPARING,
        orderRequest: deliveryRequest,
      } as CreateOrderDto;

      const order = await createOrder({
        dto: orderDto,
      });

      // 사용 포인트 차감
      if (usedPoint) {
        await createUsePointTransaction({
          userId,
          orderId: order.id,
          amount: pointList[i],
        });
      }

      // TODO :: card와 bank transfer에 따라 분기가 필요합니다
      // 구매 포인트 적립
      await createEarnPointTransaction({
        userId,
        orderId: order.id,
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
