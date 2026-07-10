import type { SearchParams } from 'nuqs/server';
import { Divider } from '@heroui/react';
import { QueryHydrationProvider } from '@/shared';
import { getClientOrderListApi } from '@/features/order/order-list';
import { OrderListSearchParamsGenerator } from '@/features/order/order-list/infrastructure';
import { LoginHeader } from '@/widget/Header/LoginHeader';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { OrderListSearch, OrderList } from './ui';

type Props = {
  searchParams: Promise<SearchParams>;
};

export const OrderListPage = async ({ searchParams }: Props) => {
  const safeSearchParmas =
    await OrderListSearchParamsGenerator.getClientSafeSearchParams(searchParams);
  const result = await getClientOrderListApi(safeSearchParmas);

  // TODO :: 보일러 플레이트 제거하기
  if (!result.isSuccess) {
    return <div>Error: {result.message}</div>;
  }

  return (
    <QueryHydrationProvider initialData={result} queryKey={ORDER_QUERY_KEYS.list(safeSearchParmas)}>
      <div className="flex w-full flex-col">
        <LoginHeader />
        <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
          <div className="flex w-5xl flex-col gap-4">
            <div className="mt-4 flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">주문 내역</span>
                <span className="text-foreground-500">
                  고객님의 주문 정보를 확인하실 수 있습니다
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link href="/order" className="text-foreground-600">
                  상품조회
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-brand font-bold">주문내역</span>
              </div>
            </div>
            <Divider />
            <OrderListSearch />
            <OrderList searchParams={safeSearchParmas} />
          </div>
        </div>
      </div>
    </QueryHydrationProvider>
  );
};
