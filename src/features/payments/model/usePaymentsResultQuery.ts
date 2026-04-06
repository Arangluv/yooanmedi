'use client';

import { parseAsString, parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { paymentsResultQuerySchema } from './schema/payments-result-query-schema';

const searchParamsOptions = {
  status: parseAsStringLiteral(['success', 'error']),
  amount: parseAsInteger,
  approvalDate: parseAsString,
  shopOrderNo: parseAsString,
  message: parseAsString,
  code: parseAsString,
};

const usePaymentsResultQuery = () => {
  const [query] = useQueryStates(searchParamsOptions);
  const resultSearchParams = paymentsResultQuerySchema.safeParse(query);

  return { isParseSuccess: resultSearchParams.success, data: resultSearchParams.data };
};

export default usePaymentsResultQuery;
