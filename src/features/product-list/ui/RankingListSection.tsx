'use client';

import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/entities/product';
import EmptyProductList from '@/entities/product/ui/EmptyProductList';
import { EndPointResult } from '@/shared';
import { getProductRankingList } from '../api/product-list.api';
import ProductList from './ProductList';

const RankingListSection = () => {
  const { data: result, isLoading } = useQuery<EndPointResult<Product[]>>({
    queryKey: ['ranking-products'],
    queryFn: () => getProductRankingList(),
  });

  if (isLoading || !result) {
    return (
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-2xl font-bold">
          실시간 <span className="text-brand">인기상품</span>
        </h2>
        <div className="bg-muted h-[260px] w-full animate-pulse"></div>
      </div>
    );
  }

  if (!result.isSuccess) {
    return (
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-2xl font-bold">
          실시간 <span className="text-brand">인기상품</span>
        </h2>
        <div className="bg-muted h-[260px] w-full animate-pulse">{result.message}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      {result.data?.length > 0 ? (
        <ProductList products={result.data} />
      ) : (
        <EmptyProductList title="인기상품을 준비중입니다." description="인기상품을 준비중입니다." />
      )}
    </div>
  );
};

export default RankingListSection;
