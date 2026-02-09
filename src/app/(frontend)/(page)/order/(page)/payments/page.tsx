import { PaymentsView } from '@/features/payments';
import { Navbar } from '@/entities/order';

const PaymentsPage = async () => {
  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <PaymentsView />
    </div>
  );
};

export default PaymentsPage;
