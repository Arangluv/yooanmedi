import { generateSearchParams } from '../lib/generate-search-params';
import OrderStatusTab from './OrderStatusTab';
import OrderListTableSection from './table/OrderListTableSection';
import { AlertDialog } from '@/views/admin/order-detail/model/providers/AlertDialogProvider';
import { SearchParams } from 'nuqs';
import { getOrderList } from '../api/order-list.api';
import { OrderListHydrationProvider } from '../model/providers/OrderListHydrationProvider';

const AdminOrderListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const safeSearchParam = await generateSearchParams(searchParams);
  const orderList = await getOrderList({
    page: safeSearchParam.page,
    orderStatus: safeSearchParam.orderStatus,
  });

  return (
    <OrderListHydrationProvider
      initialData={orderList}
      page={safeSearchParam.page}
      orderStatus={safeSearchParam.orderStatus}
    >
      <AlertDialog>
        <div className="bg-muted flex h-[calc(100vh-var(--app-header-height))] flex-col gap-8 overflow-hidden px-[60px] py-[30px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">주문 내역</h1>
            <p className="text-muted-foreground">고객 주문현황을 확인 및 관리하실 수 있습니다</p>
          </div>
          <OrderStatusTab />
          <OrderListTableSection searchParams={safeSearchParam} />
        </div>
      </AlertDialog>
    </OrderListHydrationProvider>
  );
};

export default AdminOrderListPage;
