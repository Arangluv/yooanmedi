import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { AdminOrderListResult, AdminOrderListSearchParams } from '@/features/order/order-list';
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';

interface Props {
  initialData: EndPointResult<AdminOrderListResult>;
  children: React.ReactNode;
  searchParams: AdminOrderListSearchParams;
}

export function OrderListHydrationProvider({ searchParams, initialData, children }: Props) {
  const queryClient = new QueryClient();
  const queryKey = ORDER_LIST_QUERY_KEYS.admin(searchParams);
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
