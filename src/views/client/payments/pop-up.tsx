'use client';

import { useEffect } from 'react';

const PaymentsPopupCallbackPage = () => {
  // const { isParseSuccess, data } = usePaymentsResultQuery();
  const isParseSuccess = true;
  const data = {
    status: 'success',
    approvalDate: '20262155',
    amount: 3000,
    shopOrderNo: '454685515',
  };

  useEffect(() => {
    if (!isParseSuccess || !data) {
      return;
    }

    if (data.status === 'success') {
      window.opener.postMessage(data, '*');
      window.close();
      return;
    }

    // if (data.status === 'error') {
    //   const errorCode = data.code ? data.code : 'UNKNOWN_ERROR';
    //   // TODO :: 개선이 필요합니다
    //   const errorMessage =
    //     errorCodeToMessage[errorCode as keyof typeof errorCodeToMessage] ??
    //     errorCodeToMessage['UNKNOWN_ERROR'];

    //   window.opener.postMessage(
    //     {
    //       status: 'error',
    //       message: errorMessage,
    //     },
    //     '*',
    //   );
    //   window.close();
    //   return;
    // }
  }, [data, isParseSuccess]);

  return <div />;
};

export default PaymentsPopupCallbackPage;
