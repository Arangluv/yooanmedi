import type { SearchParams } from 'nuqs/server';

import { OrderListView, loadSearchParams } from '@/features/order-list';
import { Navbar } from '@/entities/order';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const OrderListPage = async ({ searchParams }: PageProps) => {
  const { from, to, pn_keyword, order_status } = await loadSearchParams(searchParams);
  console.log('server search params?');
  console.log('from:', from);
  console.log('to:', to);
  console.log('pn_keyword:', pn_keyword);
  console.log('order_status:', order_status);
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
      <OrderListView />
    </div>
  );
};

export default OrderListPage;
