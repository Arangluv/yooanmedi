'use client';

import EmptyProductList from '@/entities/product/ui/EmptyProductList';
import ProductList from './ProductList';
import { useRankingProductList } from '../hooks';

// 해당 컴포넌트의 중복을 제거하는 좋은 코드패턴 찾아보기 -> front part refactoring시
const RankingListSection = () => {
  const { data, isLoading } = useRankingProductList();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-2xl font-bold">
          실시간 <span className="text-brand">인기상품</span>
        </h2>
        <div className="bg-muted h-[260px] w-full animate-pulse"></div>
      </div>
    );
  }

  if (data.length === 0) {
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      <EmptyProductList title="인기상품을 준비중입니다." description="인기상품을 준비중입니다." />
    </div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      <ProductList products={data} />
    </div>
  );
};

export default RankingListSection;
