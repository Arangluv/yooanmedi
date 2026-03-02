import OrderStatusTab from './OrderStatusTab';
import OrderListTableSection from './table/OrderListTableSection';
import { OrderListDialogProvider } from '../model/dialog-providers';
import StatusChangeDialogContent from './StatusChangeDialogContent';
import { OrderAction } from '@/features/order/admin/model/order-action-dialog-provider';

const ListView = () => {
  return (
    <OrderAction>
      <div className="bg-muted flex h-[calc(100vh-var(--app-header-height))] flex-col gap-8 overflow-hidden px-[60px] py-[30px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">주문 내역</h1>
          <p className="text-muted-foreground">고객 주문현황을 확인 및 관리하실 수 있습니다</p>
        </div>
        <OrderStatusTab />
        <OrderListTableSection />
      </div>
      {/* <StatusChangeDialogContent /> */}
    </OrderAction>
  );
};

export default ListView;
