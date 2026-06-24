import { PaymentsView } from '@/features/user-payment';
import { Navbar } from '@/entities/order';

const PaymentPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <PaymentsView />
    </div>
  );
};

export default PaymentPage;
