import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { ClientOrderResult, ClientOrderListSearchParams } from '@/features/order/order-list';
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';

interface Props {
  initialData: EndPointResult<ClientOrderResult>;
  searchParams: ClientOrderListSearchParams;
  children: React.ReactNode;
}

export function ClientOrderListHydrationProvider({ initialData, searchParams, children }: Props) {
  const queryClient = new QueryClient();
  const queryKey = ORDER_LIST_QUERY_KEYS.client(searchParams);
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
