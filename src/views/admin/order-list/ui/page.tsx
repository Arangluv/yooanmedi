import { generateSearchParams } from '../lib/generate-search-params';
import OrderStatusTab from './OrderStatusTab';
import OrderListTableSection from './table/OrderListTableSection';
import { AlertDialogProvider } from '@/shared';
import { SearchParams } from 'nuqs';
import { getOrderList } from '../api/order-list.api';
import { OrderListHydrationProvider } from '../model/providers/OrderListHydrationProvider';
import { OrderListSearchParamsGenerator } from '@/features/order/order-list/infrastructure';
import { adminOrderListService } from '@/features/order/order-list';

const AdminOrderListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const safeSearchParam =
    await OrderListSearchParamsGenerator.getAdminSafeSearchParams(searchParams);
  const orderList = await adminOrderListService.getOrderList(safeSearchParam);

  return (
    <OrderListHydrationProvider initialData={orderList} searchParams={safeSearchParam}>
      <AlertDialogProvider>
        <div className="bg-muted flex h-[calc(100vh-var(--app-header-height))] flex-col gap-8 overflow-hidden px-[60px] py-[30px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">주문 내역</h1>
            <p className="text-muted-foreground">고객 주문현황을 확인 및 관리하실 수 있습니다</p>
          </div>
          <OrderStatusTab />
          <OrderListTableSection searchParams={safeSearchParam} />
        </div>
      </AlertDialogProvider>
    </OrderListHydrationProvider>
  );
};

export default AdminOrderListPage;
