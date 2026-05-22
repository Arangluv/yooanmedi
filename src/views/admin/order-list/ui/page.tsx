import { SearchParams } from 'nuqs';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { OrderListSearchParamsGenerator } from '@/features/order/order-list/server';
import { getAdminOrderList } from '@/features/order/order-list';
import { QueryHydrationProvider, AlertDialogProvider } from '@/shared';
import OrderStatusTab from './OrderStatusTab';
import OrderListTableSection from './table/OrderListTableSection';

const AdminOrderListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const safeSearchParam =
    await OrderListSearchParamsGenerator.getAdminSafeSearchParams(searchParams);
  const orderList = await getAdminOrderList(safeSearchParam);

  return (
    <QueryHydrationProvider
      initialData={orderList}
      queryKey={ORDER_QUERY_KEYS.list(safeSearchParam)}
    >
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
    </QueryHydrationProvider>
  );
};

export default AdminOrderListPage;
