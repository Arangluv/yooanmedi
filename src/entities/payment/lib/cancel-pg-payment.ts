'use server';

import crypto from 'crypto';
import moment from 'moment-timezone';

import { generateUUID32digits } from '@/shared/lib/identifier';
import { getPaymentPgCno } from '../api/get-pg-cno';
import { cancelPaymentSchema } from '../model/cancel-schema';
import { CANCEL_REVISE_TYPE } from '../constant/cancel-revise-type';
import { cancelResponseSchema } from '@/entities/order-product';

type CancelPgPaymentParams = {
  orderProductId: number;
  amount: number;
};

export const cancelPgPayment = async ({ orderProductId, amount }: CancelPgPaymentParams) => {
  try {
    const shopTransactionId = generateUUID32digits();
    const pgCno = await getPaymentPgCno(orderProductId);
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
      amount,
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

    return cancelResponse;
  } catch (error) {
    throw error;
  }
};
