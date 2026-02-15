import type { ProductItem } from '@/entities/product';
import ProductList from '../ProductList';

import ProductListPagination from '../ProductListPagination';

import EmptyProductList from '@/entities/product/ui/EmptyProductList';
import RankingListSection from '../RankingListSection';

const ProductDefaultView = ({
  products,
  totalPages,
}: {
  products: ProductItem[];
  totalPages: number;
}) => {
  return (
    <section className="mt-16 flex w-5xl flex-shrink-0 flex-col gap-16">
      <RankingListSection />
      <DefaultListSection products={products} />
      <ProductListPagination totalPages={totalPages} />
    </section>
  );
};

const DefaultListSection = ({ products }: { products: ProductItem[] }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <span className="text-brand">전체상품</span> 살펴보기
      </h2>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <EmptyProductList
          title="상품이 없습니다"
          description="등록된 상품이 없습니다. 다른 조건으로 검색해보세요"
        />
      )}
    </div>
  );
};

export default ProductDefaultView;
