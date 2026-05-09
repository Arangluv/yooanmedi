import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { OrderStatus } from '@/entities/order';
import { adminOrderListQueryKey } from '../../lib/query-keys';
import { type AdminOrderListResult } from '@/pages/admin/order-list';

interface Props {
  initialData: EndPointResult<AdminOrderListResult>;
  children: React.ReactNode;
  page: number;
  orderStatus: OrderStatus | 'all'; // todo 어디에 사용할지 알고 있는 상태다 -> entity는 몰라야한다
}

export function OrderListHydrationProvider({ page, orderStatus, initialData, children }: Props) {
  const queryClient = new QueryClient();
  const queryKey = adminOrderListQueryKey(page, orderStatus);
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
