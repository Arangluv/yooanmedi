import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { EndPointResult } from '@/shared';
import { cartQueryKey } from '../hooks/useCartQuery';
import { type Cart } from '../cart.schema';

interface Props {
  initialData: EndPointResult<Cart>;
  children: React.ReactNode;
}

export function CartHydrationProvider({ initialData, children }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(cartQueryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
