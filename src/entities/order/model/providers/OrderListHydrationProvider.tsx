import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { type OrderListResult } from '../schemas/order.schema';
import { OrderStatus } from '../../constants/order-status';
import { adminOrderListQueryKey } from '../../lib/query-keys';

interface Props {
  initialData: EndPointResult<OrderListResult>;
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
