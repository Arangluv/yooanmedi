'use client';

import { useEffect } from 'react';
import { usePaymentsResultQuery } from '@/features/user-payment';

const PaymentsPopupCallbackPage = () => {
  const paymentResult = usePaymentsResultQuery();

  useEffect(() => {
    window.opener.postMessage(paymentResult, '*');
    window.close();
  }, [paymentResult]);

  return <div />;
};

export default PaymentsPopupCallbackPage;
