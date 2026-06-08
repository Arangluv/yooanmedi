import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { GetCartDetailResponse } from '../types';
import { CART_DETAIL_QUERY_KEYS } from '../api';

interface Props {
  initialData: GetCartDetailResponse;
  children: React.ReactNode;
}

export function CartDetailHydrator({ initialData, children }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(CART_DETAIL_QUERY_KEYS.all(), initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
