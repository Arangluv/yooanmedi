import { PaymentsView } from '@/features/payments';
import { Navbar } from '@/entities/order';

export default function PaymentsPage() {
  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <PaymentsView />
    </div>
  );
}
