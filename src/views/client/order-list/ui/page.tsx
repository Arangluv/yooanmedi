import { type SearchParams } from 'nuqs/server';
import { Divider } from '@heroui/react';
import { LoginHeader } from '@/widget/Header/LoginHeader';
import { getClientOrderListApi } from '@/features/order/order-list';
import { OrderListSearchParamsGenerator } from '@/features/order/order-list/infrastructure';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { QueryHydrationProvider } from '@/shared';
import OrderListTitle from './OrderListTitle';
import OrderListSearch from './OrderListSearch';
import OrderList from './OrderList';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const ClientOrderListPage = async ({ searchParams }: PageProps) => {
  const safeSearchParmas =
    await OrderListSearchParamsGenerator.getClientSafeSearchParams(searchParams);
  const result = await getClientOrderListApi(safeSearchParmas);

  // TODO :: 보일러 플레이트 제거하기 -> Error 경계에서 해당 코드책임을 위임
  if (!result.isSuccess) {
    return <div>Error: {result.message}</div>;
  }

  return (
    <QueryHydrationProvider initialData={result} queryKey={ORDER_QUERY_KEYS.list(safeSearchParmas)}>
      <div className="flex w-full flex-col">
        <LoginHeader />
        <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
          <div className="flex w-5xl flex-col gap-4">
            <OrderListTitle />
            <Divider />
            <OrderListSearch />
            <OrderList searchParams={safeSearchParmas} />
          </div>
        </div>
      </div>
    </QueryHydrationProvider>
  );
};

export default ClientOrderListPage;
