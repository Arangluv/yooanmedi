'use client';

import { useQuery } from '@tanstack/react-query';

import type { ProductItem } from '@/entities/product/model/types';
import EmptyProductList from '@/entities/product/ui/EmptyProductList';

import ProductList from './ProductList';
import { getProductListConvertedToCustomPrice } from '@/features/custom-price/api/get-product-list';

const RankingListSection = () => {
  const { data: rankingProducts, isLoading } = useQuery<ProductItem[]>({
    queryKey: ['ranking-products'],
    queryFn: () => getProductListConvertedToCustomPrice(),
  });

  if (isLoading || !rankingProducts) {
    return (
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-2xl font-bold">
          실시간 <span className="text-brand">인기상품</span>
        </h2>
        <div className="bg-muted h-[260px] w-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      {rankingProducts?.length > 0 ? (
        <ProductList products={rankingProducts} />
      ) : (
        <EmptyProductList title="인기상품을 준비중입니다." description="인기상품을 준비중입니다." />
      )}
    </div>
  );
};

export default RankingListSection;
