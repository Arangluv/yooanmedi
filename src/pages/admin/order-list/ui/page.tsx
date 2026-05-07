import { OrderFindOption } from '@/entities/order/lib/find-options';
import { generateSearchParams } from '../lib/generate-search-params';
import OrderStatusTab from './OrderStatusTab';
import OrderListTableSection from './table/OrderListTableSection';
import { OrderAction } from '@/pages/admin/order-detail/model/order-action-dialog-provider';
import { SearchParams } from 'nuqs';
import { getOrderList } from '@/entities/order/api/order.api';
import { OrderListHydrationProvider } from '@/entities/order/model/providers/OrderListHydrationProvider';

const AdminOrderListPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const safeSearchParam = await generateSearchParams(searchParams);
  const findOption = OrderFindOption.adminOrderList.build(
    safeSearchParam.page,
    safeSearchParam.orderStatus,
  );
  const orderList = await getOrderList(findOption);

  return (
    <OrderListHydrationProvider
      initialData={orderList}
      page={safeSearchParam.page}
      orderStatus={safeSearchParam.orderStatus}
    >
      <OrderAction>
        <div className="bg-muted flex h-[calc(100vh-var(--app-header-height))] flex-col gap-8 overflow-hidden px-[60px] py-[30px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">주문 내역</h1>
            <p className="text-muted-foreground">고객 주문현황을 확인 및 관리하실 수 있습니다</p>
          </div>
          <OrderStatusTab />
          <OrderListTableSection searchParams={safeSearchParam} />
        </div>
      </OrderAction>
    </OrderListHydrationProvider>
  );
};

export default AdminOrderListPage;
