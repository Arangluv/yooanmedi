import PaymentProgressInfo from './PaymentProgressInfo';
import PaymentsOverview from './PaymentsOverview';

const PaymentsView = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex min-h-[calc(100vh-469px)] w-5xl flex-col">
        <PaymentProgressInfo step="payment" />
        <PaymentsOverview />
      </div>
    </div>
  );
};

export default PaymentsView;
