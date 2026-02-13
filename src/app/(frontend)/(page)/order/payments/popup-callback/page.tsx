'use client';

import { usePaymentsResultQuery } from '@/features/payments';
import { useEffect } from 'react';

const errorCodeToMessage = {
  W324: '결제를 취소했습니다',
  W001: '결제를 취소했습니다',
  UNKNOWN_ERROR: '결제 요청을 처리하는데 문제가 발생했습니다',
};

const PaymentsPopupCallbackPage = () => {
  const { isParseSuccess, data } = usePaymentsResultQuery();

  useEffect(() => {
    if (!isParseSuccess || !data) {
      return;
    }

    if (data.status === 'success') {
      window.opener.postMessage(data, '*');
      window.close();
      return;
    }

    if (data.status === 'error') {
      const errorCode = data.code ? data.code : 'UNKNOWN_ERROR';
      // TODO :: 개선이 필요합니다
      const errorMessage =
        errorCodeToMessage[errorCode as keyof typeof errorCodeToMessage] ??
        errorCodeToMessage['UNKNOWN_ERROR'];

      window.opener.postMessage(
        {
          status: 'error',
          message: errorMessage,
        },
        '*',
      );
      window.close();
      return;
    }
  }, [data, isParseSuccess]);

  return <div />;
};

export default PaymentsPopupCallbackPage;
