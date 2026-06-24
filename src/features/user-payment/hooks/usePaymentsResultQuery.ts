'use client';

import { parseAsString, parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { USER_PAYMENT_CONSTANTS } from '../constants';
import { PaymentResultSearchParamSchemas } from '../schemas';
import { ZodSchemaParser } from '@/shared';

const searchParamsOptions = {
  status: parseAsStringLiteral([
    USER_PAYMENT_CONSTANTS.status.success,
    USER_PAYMENT_CONSTANTS.status.fail,
  ]),
  message: parseAsString,
  amount: parseAsInteger,
  approvalDate: parseAsString,
  shopOrderNo: parseAsString,
};

export const usePaymentsResultQuery = () => {
  const [queries] = useQueryStates(searchParamsOptions);

  if (queries.status === USER_PAYMENT_CONSTANTS.status.success) {
    return ZodSchemaParser.safeParseOrThrow(PaymentResultSearchParamSchemas.success, {
      data: {
        status: queries.status,
        amount: queries.amount,
        approvalDate: queries.approvalDate,
        shopOrderNo: queries.shopOrderNo,
      },
      errorMsg: '잘못된 결제결과 url입니다',
    });
  }

  console.log('queries');
  console.log(queries);

  return ZodSchemaParser.safeParseOrThrow(PaymentResultSearchParamSchemas.fail, {
    data: {
      status: queries.status,
      message: queries.message,
    },
    errorMsg: '잘못된 결제결과 url입니다',
  });
};
