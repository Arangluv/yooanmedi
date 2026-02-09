import type { SearchParams } from 'nuqs/server';

import { OrderListView, loadSearchParams } from '@/features/order-list';
import { Navbar } from '@/entities/order';
import { getOrderList } from '@/features/order-list/api/get-order-list';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const OrderListPage = async ({ searchParams }: PageProps) => {
  const { from, to, pn_keyword, order_status } = await loadSearchParams(searchParams);
  const orderList = await getOrderList();
  // const { data } = useQuery({
  //   queryKey: ['order-list', start, end, prodNameSearchParam],
  //   queryFn: () =>
  //     getOrderList({
  //       userId: user?.id?.toString() || '',
  //       start: start,
  //       end: end,
  //       productName: prodNameSearchParam,
  //     }),
  //   enabled: !!user?.id && !!start && !!end,
  // });

  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <OrderListView orderList={orderList} />
    </div>
  );
};

export default OrderListPage;
