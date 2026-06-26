import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { FAVORITE_QUERY_KEYS, GetFavoriteProductsApiReponse } from '../api';

interface Props {
  initialData: GetFavoriteProductsApiReponse;
  children: React.ReactNode;
}

export function FavoriteProductsHydrator({ initialData, children }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(FAVORITE_QUERY_KEYS.favoriteProducts(), initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
