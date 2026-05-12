import type { SearchParams } from 'nuqs/server';
import { generateSearchParam } from '@/features/order/order-list/infrastructure';
import { Navbar } from '@/entities/order';
import { getClientOrderList } from '@/features/order/order-list/infrastructure';
import { Divider } from '@heroui/react';
import OrderListTitle from './OrderListTitle';
import OrderListSearch from './OrderListSearch';
import OrderList from './OrderList';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const ClientOrderListPage = async ({ searchParams }: PageProps) => {
  const safeSearchParmas = await generateSearchParam(searchParams);
  const result = await getClientOrderList(safeSearchParmas);

  // TODO :: 보일러 플레이트 제거하기 -> Error 경계에서 해당 코드책임을 위임
  if (!result.isSuccess) {
    return <div>Error: {result.message}</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
        <div className="flex w-5xl flex-col gap-4">
          <OrderListTitle />
          <Divider />
          <OrderListSearch />
          <OrderList orderList={result.data} />
        </div>
      </div>
    </div>
  );
};

export default ClientOrderListPage;
