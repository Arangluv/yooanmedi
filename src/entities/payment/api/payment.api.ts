'use server';

import crypto from 'crypto';
import moment from 'moment-timezone';
import { ZodSchemaParser, SchemaParserDto, generateUUID32digits, EASYPAY_CONFIG } from '@/shared';
import { CancelPaymentRequestDto } from '../dto';
import { cancelPaymentRequestSchema } from '../schemas';

// todo :: 임시사용 -> move to other entity or features
export const cancelPgPaymentAll = async (dto: CancelPaymentRequestDto) => {
  try {
    const shopTransactionId = generateUUID32digits();
    const authMsg = `${dto.pgCno}|${shopTransactionId}`;
    const hashedAuthMsg = crypto
      .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
      .update(authMsg)
      .digest('hex');

    const schemaDto = {
      data: {
        pgCno: dto.pgCno,
        amount: dto.amount,
        mallId: process.env.PAYMENTS_MID,
        shopTransactionId: shopTransactionId,
        reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.total,
        cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
        msgAuthValue: hashedAuthMsg,
      },
      errorMsg: '이지페이 결제 취소요청에 실패했습니다. 잘못된 취소요청 데이터입니다',
    } as SchemaParserDto;
    const requestDto = ZodSchemaParser.safeParseOrThrow(cancelPaymentRequestSchema, schemaDto);

    const response = await fetch(process.env.PAYMENTS_CANCEL_URL as string, {
      method: 'POST',
      body: JSON.stringify(requestDto),
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
  } catch (error) {
    throw error;
  }
};
