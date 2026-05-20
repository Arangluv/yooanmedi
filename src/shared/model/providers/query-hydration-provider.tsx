import { dehydrate, HydrationBoundary, QueryClient, QueryKey } from '@tanstack/react-query';
import { EndPointResult } from '../end-point-result';
import React from 'react';

interface QueryHydrationProviderProps<T> {
  queryKey: QueryKey;
  children: React.ReactNode;
  initialData: EndPointResult<T>;
}

export function QueryHydrationProvider<T>({
  children,
  queryKey,
  initialData,
}: QueryHydrationProviderProps<T>) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(queryKey, initialData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
