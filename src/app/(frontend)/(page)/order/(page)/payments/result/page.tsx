import { PaymentsNavbar, PaymentsResultOverview } from '@/features/payments';

const PaymentsResultPage = () => {
  return (
    <div className="flex w-full flex-col">
      <PaymentsNavbar />
      <PaymentsResultOverview />
    </div>
  );
};

export default PaymentsResultPage;
