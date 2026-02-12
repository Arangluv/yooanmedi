'use client';

import usePaymentsResultQuery from '../../model/usePaymentsResultQuery';
import PaymentProgressInfo from '../PaymentProgressInfo';
import PaymentSuccess from './PaymentSuccess';
import PaymentsFail from './PaymentsFail';

const PaymentsResultOverview = () => {
  const { isParseSuccess, data } = usePaymentsResultQuery();

  if (!isParseSuccess || !data) {
    return <PaymentsFail message={'잘못된 접근입니다.'} />;
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-5xl flex-col">
        <PaymentProgressInfo step="finish" />
        {data.status === 'success' ? (
          <PaymentSuccess
            amount={data.amount}
            approvalDate={data.approvalDate}
            shopOrderNo={data.shopOrderNo}
          />
        ) : (
          <PaymentsFail message={data.message ?? '결제 요청을 처리하는데 문제가 발생했습니다'} />
        )}
      </div>
    </div>
  );
};

export default PaymentsResultOverview;
