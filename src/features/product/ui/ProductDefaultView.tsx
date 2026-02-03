import type { ProductItem } from '@/entities/product/model/types';
import ProductList from './ProductList';

import ProductListPagination from './ProductListPagination';

import EmptyProductList from '@/entities/product/ui/EmptyProductList';
import EmptyRankingProductList from '@/entities/product/ui/EmptyRankingProductList';

const ProductDefaultView = ({
  products,
  totalPages,
}: {
  products: ProductItem[];
  totalPages: number;
}) => {
  return (
    <section className="mt-16 flex w-5xl flex-shrink-0 flex-col gap-16">
      <RankingListSection products={products} />
      <DefaultListSection products={products} />
      <ProductListPagination totalPages={totalPages} />
    </section>
  );
};

const RankingListSection = ({ products }: { products: ProductItem[] }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      {products.length > 0 ? <ProductList products={products} /> : <EmptyRankingProductList />}
    </div>
  );
};

const DefaultListSection = ({ products }: { products: ProductItem[] }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <span className="text-brand">전체상품</span> 살펴보기
      </h2>
      {products.length > 0 ? <ProductList products={products} /> : <EmptyProductList />}
    </div>
  );
};

export default ProductDefaultView;
