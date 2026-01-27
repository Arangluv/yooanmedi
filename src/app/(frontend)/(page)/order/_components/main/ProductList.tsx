'use client';

import ProductItem from './ProductItem';
import ProductListPagination from './Pagination';
import { useQuery } from '@tanstack/react-query';
import { getBestProducts } from '@order/actions';
import { ProductItemType } from '../../_type';

export default function ProductList({
  totalPages,
  products,
}: {
  totalPages: number;
  products: ProductItemType[];
}) {
  return (
    <section className="mt-16 flex w-5xl flex-shrink-0 flex-col gap-16">
      <RankingSection />
      <AllProductSection data={products} />
      <ProductListPagination totalPages={totalPages} />
    </section>
  );
}

function RankingSection() {
  const { data } = useQuery({
    queryKey: ['best-products'],
    queryFn: () => getBestProducts(),
  });

  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      {/* 인기상품 리스트 섹션 */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8">
          {data.map((item) => (
            <ProductItem key={item.id} productItem={item as unknown as ProductItemType} />
          ))}
        </div>
      ) : (
        <EmptyRankingSection />
      )}
    </div>
  );
}

function EmptyRankingSection() {
  return (
    <div className="flex h-[260px] w-full items-center justify-center rounded-lg bg-neutral-50">
      <span className="text-foreground-600">인기상품을 준비중입니다.</span>
    </div>
  );
}

function AllProductSection({ data }: { data: ProductItemType[] }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <span className="text-brand">전체상품</span> 살펴보기
      </h2>
      {/* 인기상품 리스트 섹션 */}
      {data.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8">
          {data.map((item) => (
            <ProductItem key={item.id} productItem={item} />
          ))}
        </div>
      ) : (
        <EmptyAllProductSection />
      )}
    </div>
  );
}

function EmptyAllProductSection() {
  return (
    <div className="border-foreground-200 flex h-[260px] w-full items-center justify-center rounded-lg border border-dotted">
      <span className="text-foreground-600">현재 등록된 상품이 없습니다.</span>
    </div>
  );
}
