import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { FAVORITE_QUERY_KEYS, GetFavoriteApiReponse } from '../api';

interface Props {
  initialData: GetFavoriteApiReponse;
  children: React.ReactNode;
}

export function FavoritesHydrator({ initialData, children }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(FAVORITE_QUERY_KEYS.favorites(), initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
