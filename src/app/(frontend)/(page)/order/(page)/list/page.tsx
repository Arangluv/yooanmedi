import type { SearchParams } from 'nuqs/server';

import { OrderListView, loadSearchParams } from '@/features/order-list';
import { getOrderList } from '@/features/order-list';
import { Navbar } from '@/entities/order';
import { getUserByHeader } from '@/entities/user';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const OrderListPage = async ({ searchParams }: PageProps) => {
  const user = await getUserByHeader();
  const orderListSearchParams = await loadSearchParams(searchParams);

  const orderList = await getOrderList({ user, searchParams: orderListSearchParams });

  // TODO :: 보일러플레이트 코드 -> 제거하기
  if (!orderList.success) {
    return <div>Error: {orderList.message}</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <OrderListView orderList={orderList.data} />
    </div>
  );
};

export default OrderListPage;
