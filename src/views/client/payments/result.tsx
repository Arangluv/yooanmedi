import { PaymentsResultOverview } from '@/features/user-payment';
import { Navbar } from '@/entities/order';

const PaymentsResultPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <PaymentsResultOverview />
    </div>
  );
};

export default PaymentsResultPage;
