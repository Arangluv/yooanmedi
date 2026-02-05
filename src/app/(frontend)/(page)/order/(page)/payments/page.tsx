import { PaymentsNavbar, PaymentsView } from '@/features/payments';

export default function PaymentsPage() {
  return (
    <div className="flex w-full flex-col">
      <PaymentsNavbar />
      <PaymentsView />
    </div>
  );
}
