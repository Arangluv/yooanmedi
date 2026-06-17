import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  PRODUCT_LIST_QUERY_KEYS,
  GetProductListApiResponse,
  GetRankingProductListApiResponse,
} from '../api';
import { ProductListServerSearchParams } from '../infrastructure';

interface Props {
  initialData: {
    ranking: GetRankingProductListApiResponse;
    list: GetProductListApiResponse;
  };
  searchParams: ProductListServerSearchParams;
  children: React.ReactNode;
}

export function ProductListHydrator({ initialData, children, searchParams }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(PRODUCT_LIST_QUERY_KEYS.ranking(), initialData.ranking);
  queryClient.setQueryData(PRODUCT_LIST_QUERY_KEYS.list(searchParams), initialData.list);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
