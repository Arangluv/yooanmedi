import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { adminOrderListQueryKey } from '../../lib/query-keys';
import { AdminOrderListResult, AdminOrderListSearchParams } from '@/features/order/order-list';

interface Props {
  initialData: EndPointResult<AdminOrderListResult>;
  children: React.ReactNode;
  searchParams: AdminOrderListSearchParams;
}

export function OrderListHydrationProvider({ searchParams, initialData, children }: Props) {
  const queryClient = new QueryClient();
  const queryKey = adminOrderListQueryKey(searchParams.page, searchParams.orderStatus);
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
