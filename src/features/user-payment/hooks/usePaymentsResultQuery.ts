'use client';

import { parseAsString, parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { USER_PAYMENT_CONSTANTS } from '../constants';

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
  return useQueryStates(searchParamsOptions);
};
