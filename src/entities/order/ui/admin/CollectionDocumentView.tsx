import { AlertDialog } from '@/shared/ui/shadcn/alert-dialog';

import CurrentOrderInfo from './CurrentOrderInfo';
import PaymentsOverview from './PaymentsOverview';
import OrderUserOverview from './OrderUserOverview';
import DeliveryInfoOverview from './DeliveryInfoOverview';
import CancelRequestOrderInfo from './CancelRequestOrderInfo';
import CancelOrderInfo from './CancelOrderInfo';
import OrderAlertDialogContent from './OrderAlertDialogContent';

const CollectionDocumentView = () => {
  return (
    <AlertDialog>
      <div className="bg-muted dark:bg-background h-full w-full px-[60px] py-[30px]">
        <div className="flex gap-12">
          {/* left */}
          <div className="flex w-[70%] flex-col gap-6">
            <CurrentOrderInfo />
            <CancelRequestOrderInfo />
            <CancelOrderInfo />
          </div>
          {/* right */}
          <div className="flex w-[30%] flex-col gap-6">
            {/* 결제 정보 */}
            <PaymentsOverview />
            {/* 주문자 */}
            <OrderUserOverview />
            {/* 배송지 정보 */}
            <DeliveryInfoOverview />
          </div>
        </div>
      </div>
      <OrderAlertDialogContent />
    </AlertDialog>
  );
};

export default CollectionDocumentView;
