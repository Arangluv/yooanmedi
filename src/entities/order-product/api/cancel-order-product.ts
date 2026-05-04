'use server';

import crypto from 'crypto';
import moment from 'moment-timezone';

import {
  createCancelEarnPointTransaction,
  createCancelUsePointTransaction,
} from '@/entities/point';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-method';
import { getPayload } from '@/shared/infrastructure';
import { generateUUID32digits } from '@/shared/lib/identifier';

import {
  cancelOrderProductSchema,
  cancelResponseSchema,
} from '../model/cancel-order-product-schema';
import { ORDER_PRODUCT_STATUS } from '../constants/order-product-status';
import { CANCEL_REVISE_TYPE, createPayment, getPaymentPgCno } from '@/entities/payment';
import { cancelPaymentSchema } from '@/entities/payment/model/cancel-schema';

type CancelOrderParams = {
  orderProductId: number;
};

type CancelOrderSuccessResult = {
  success: boolean;
};

type CancelOrderErrorResult = {
  success: boolean;
  message: string;
};

export const cancelOrderProduct = async ({
  orderProductId,
}: CancelOrderParams): Promise<CancelOrderSuccessResult | CancelOrderErrorResult> => {
  try {
    const payload = await getPayload();
    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        order: true,
        orderProductStatus: true,
        priceSnapshot: true,
        productDeliveryFee: true,
        quantity: true,
        totalAmount: true,
      },
      populate: {
        product: {},
        users: {},
        order: {
          user: true,
          paymentsMethod: true,
          orderStatus: true,
          usedPoint: true,
        },
      },
    });

    const targetOrderProduct = cancelOrderProductSchema.parse(orderProduct);

    // validate
    if (targetOrderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled) {
      throw new Error('이미 취소처리된 주문입니다');
    }

    if (targetOrderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancel_request) {
      throw new Error('이미 취소요청된 주문입니다');
    }

    // USECASE 1. 카드 결제 취소시
    if (targetOrderProduct.paymentsMethod == PAYMENTS_METHOD.credit_card) {
      // 사용된 적립금 환불 처리
      if (targetOrderProduct.usedPoint > 0) {
        await createCancelUsePointTransaction({
          userId: targetOrderProduct.userId,
          orderProductId: targetOrderProduct.orderProductId,
        });
      }

      // 적립 포인트 반환 처리
      await createCancelEarnPointTransaction({
        userId: targetOrderProduct.userId,
        orderProductId: targetOrderProduct.orderProductId,
      });

      // 상품주문 상태 업데이트 하기
      await payload.update({
        collection: 'order-product',
        where: {
          id: {
            equals: targetOrderProduct.orderProductId,
          },
        },
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
        },
      });

      // 결제 취소 요청
      const shopTransactionId = generateUUID32digits();
      const pgCno = await getPaymentPgCno(targetOrderProduct.orderId);
      const authMsg = `${pgCno}|${shopTransactionId}`;
      const hashedAuthMsg = crypto
        .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
        .update(authMsg)
        .digest('hex');

      const paymentsCancelDto = cancelPaymentSchema.parse({
        mallId: process.env.PAYMENTS_MID,
        shopTransactionId: shopTransactionId,
        pgCno,
        reviseTypeCode: CANCEL_REVISE_TYPE.PARTIAL,
        amount: targetOrderProduct.totalAmount,
        cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
        msgAuthValue: hashedAuthMsg,
      });

      const response = await fetch(process.env.PAYMENTS_CANCEL_URL as string, {
        method: 'POST',
        body: JSON.stringify(paymentsCancelDto),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error('주문취소에 실패했습니다. 다시 시도해주세요.');
      }

      // 결제 취소 요청에 맞는 payment 생성
      const result = await response.json();
      if (result.resCd !== '0000') {
        throw new Error('주문취소에 실패했습니다. 다시 시도해주세요.');
      }

      const cancelResponse = cancelResponseSchema.parse(result);

      // Payment 생성
      await createPayment({
        order: targetOrderProduct.orderId,
        amount: cancelResponse.cancelAmount,
        paymentsMethod: PAYMENTS_METHOD.credit_card,
        pgCno: cancelResponse.cancelPgCno,
      });

      return {
        success: true,
      };
    }

    // USECASE 2.무통장 입금 취소 시
    // USECASE 2-1. 입금 전 취소 시 -> 상품 상태만 업데이트
    if (targetOrderProduct.orderStatus === ORDER_STATUS.pending) {
      // 사용된 적립금 환불 처리
      if (targetOrderProduct.usedPoint > 0) {
        await createCancelUsePointTransaction({
          userId: targetOrderProduct.userId,
          orderProductId: targetOrderProduct.orderProductId,
        });
      }

      // 상품주문 상태 업데이트 하기
      await payload.update({
        collection: 'order-product',
        where: {
          id: {
            equals: targetOrderProduct.orderProductId,
          },
        },
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
        },
      });
    }

    // USECASE 2-2. 입금된 이후 상품 취소 시 (admin only)
    if (targetOrderProduct.orderStatus === ORDER_STATUS.preparing) {
      // 상품주문 상태 업데이트 하기
      await payload.update({
        collection: 'order-product',
        where: {
          id: {
            equals: targetOrderProduct.orderProductId,
          },
        },
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancel_request,
        },
      });

      // 사용된 적립금 환불 처리
      if (targetOrderProduct.usedPoint > 0) {
        await createCancelUsePointTransaction({
          userId: targetOrderProduct.userId,
          orderProductId: targetOrderProduct.orderProductId,
        });
      }

      // 적립 포인트 반환 처리
      await createCancelEarnPointTransaction({
        userId: targetOrderProduct.userId,
        orderProductId: targetOrderProduct.orderProductId,
      });
    }

    // USECASE 3. 입금된 이후 상품 취소 시 (user only)
    if (targetOrderProduct.orderStatus === ORDER_STATUS.preparing) {
      // 상품주문 상태 업데이트 하기
      await payload.update({
        collection: 'order-product',
        where: {
          id: {
            equals: targetOrderProduct.orderProductId,
          },
        },
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancel_request,
        },
      });

      // 이후 어드민에서 orderProductStatus의 상태를 '취소 요청' 에서 '취소 완료'로 변경하면 아래 코드를 실행해야함
      // 사용된 적립금 환불 처리
      if (targetOrderProduct.usedPoint > 0) {
        await createCancelUsePointTransaction({
          userId: targetOrderProduct.userId,
          orderProductId: targetOrderProduct.orderProductId,
        });
      }

      // 적립 포인트 반환 처리
      await createCancelEarnPointTransaction({
        userId: targetOrderProduct.userId,
        orderProductId: targetOrderProduct.orderProductId,
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: '주문을 취소하는데 문제가 발생했습니다',
    };
  }
};
