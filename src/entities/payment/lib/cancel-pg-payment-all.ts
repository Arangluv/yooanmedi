import { getUuidWithoutHyphen } from '@/shared/lib/uuid';
import crypto from 'crypto';
import moment from 'moment-timezone';
import { CANCEL_REVISE_TYPE } from '../constant/cancel-revise-type';
import { cancelPaymentSchema } from '../model/cancel-schema';

// TODO:: 결제 트랜젝션 롤백을 구현하기위해 임시로 해당파일에 위치시켰으며 추후 리팩토링이 필요합니다.
export const cancelPgPaymentAll = async (amount: number, pgCno: string) => {
  const shopTransactionId = getUuidWithoutHyphen();
  const authMsg = `${pgCno}|${shopTransactionId}`;
  const hashedAuthMsg = crypto
    .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
    .update(authMsg)
    .digest('hex');

  const paymentsCancelDto = cancelPaymentSchema.parse({
    mallId: process.env.PAYMENTS_MID,
    shopTransactionId: shopTransactionId,
    pgCno,
    reviseTypeCode: CANCEL_REVISE_TYPE.TOTAL,
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
    throw new Error('주문취소에 실패했습니다. 관련부서에 문의해주세요.');
  }

  // 결제 취소 요청에 맞는 payment 생성
  const result = await response.json();
  if (result.resCd !== '0000') {
    throw new Error('주문취소에 실패했습니다. 관련부서에 문의해주세요.');
  }
};
