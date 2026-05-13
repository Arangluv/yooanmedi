import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { clientOrderListQueryKey } from '../../lib/query-keys';
import { type ClientOrder, type ClientOrderListSearchParams } from '@/features/order/order-list';

interface Props {
  initialData: EndPointResult<ClientOrder[]>;
  searchParams: ClientOrderListSearchParams;
  children: React.ReactNode;
}

export function ClientOrderListHydrationProvider({ initialData, searchParams, children }: Props) {
  const queryClient = new QueryClient();
  const queryKey = clientOrderListQueryKey(searchParams);
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
