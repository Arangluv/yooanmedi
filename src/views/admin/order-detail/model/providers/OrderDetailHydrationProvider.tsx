import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { type EndPointResult } from '@/shared';
import { adminOrderDetailQueryKey } from '../../lib/query-keys';
import { type AdminOrderDetail } from '../order-detail.schema';

interface Props {
  initialData: EndPointResult<AdminOrderDetail>;
  orderId: number;
  children: React.ReactNode;
}

export function OrderDetailHydrationProvider({ orderId, initialData, children }: Props) {
  const queryClient = new QueryClient();
  const queryKey = adminOrderDetailQueryKey(orderId);
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
