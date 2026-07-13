import { LoginHeader } from '@/widget/Header/LoginHeader';
import { PaymentsResultOverview } from '@/features/user-payment';

export const PaymentsResultPage = () => {
  return (
    <div className="flex w-full flex-col">
      <LoginHeader />
      <PaymentsResultOverview />
    </div>
  );
};
