'use client';

import { usePaymentsResultQuery } from '../../hooks';
import PaymentProgressInfo from '../PaymentProgressInfo';
import PaymentSuccess from './PaymentSuccess';
import PaymentsFail from './PaymentsFail';

export const PaymentsResultOverview = () => {
  const paymentResult = usePaymentsResultQuery();

  if (paymentResult.status === 'fail') {
    return <PaymentsFail message={paymentResult.message} />;
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-5xl flex-col">
        <PaymentProgressInfo step="finish" />
        <PaymentSuccess
          amount={paymentResult.amount}
          approvalDate={paymentResult.approvalDate}
          shopOrderNo={paymentResult.shopOrderNo}
        />
      </div>
    </div>
  );
};
