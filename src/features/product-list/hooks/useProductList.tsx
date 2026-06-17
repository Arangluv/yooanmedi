'use client';

import { useQuery } from '@tanstack/react-query';
import { BaseError } from '@/shared';
import { getProductListApi, GetProductListApiResponse, PRODUCT_LIST_QUERY_KEYS } from '../api';
import { ProductListSearchParams } from '../core';

export const useProductList = (searchParams: ProductListSearchParams) => {
  const { data: result, isLoading } = useQuery<GetProductListApiResponse>({
    queryFn: () => getProductListApi(searchParams),
    queryKey: PRODUCT_LIST_QUERY_KEYS.list(searchParams),
  });

  if (!result) {
    throw new BaseError({
      clientMsg: '인기상품을 불러오는데 문제가 발생했습니다',
      devMsg: 'useRankingProductList는 Hydrator내부에서 호출해야합니다',
      errorName: 'MissingQueryHydratorError',
    });
  }

  if (!result.isSuccess) {
    throw new BaseError({
      clientMsg: '인기상품을 불러오는데 문제가 발생했습니다',
      devMsg: result.message,
      errorName: 'ProductListError',
    });
  }

  return { data: result.data.products, isLoading };
};
