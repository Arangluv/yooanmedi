import Link from 'next/link';

import { Search, CircleArrowRight } from 'lucide-react';

import EmptySearchResult from '@/entities/product/ui/EmptySearchResult';
import ProductItem from './ProductItem';
import ProductListPagination from './ProductListPagination';
import ProductList from './ProductList';

interface SearchResultProps {
  products: ProductItem[];
  totalPages: number;
  keyword: string;
  condition: 'pn' | 'cn';
  totalProducts: number;
}

const ProductSearchResultView = ({
  products,
  totalPages,
  keyword,
  condition,
  totalProducts,
}: SearchResultProps) => {
  return (
    <section className="mt-16 flex w-5xl flex-shrink-0 flex-col">
      {/* result title */}
      <div className="flex w-full items-center justify-between">
        <h2 className="text-foreground-800 mb-4 flex items-center gap-1 text-lg font-bold">
          <Search className="text-brandWeek h-6 w-6" />
          검색결과
        </h2>
        <Link
          href="/order"
          className="text-brand hover:text-brandWeek flex items-center gap-1 font-bold transition-colors duration-300"
        >
          전체상품 보기
          <CircleArrowRight className="text-brandWeek h-4 w-4" />
        </Link>
      </div>
      {/* result info section */}
      <div className="border-foreground-300 mb-8 flex justify-between border-t-1 bg-neutral-50 px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <span className="text-brandWeek font-bold">
              {condition === 'pn' ? '상품명' : '제약사명'}
            </span>
            <span>으로 검색한</span>
          </div>
          <span className="text-brandWeek font-bold">"{keyword}"</span>에 대한 검색결과
        </div>
        <div>
          <span className="text-foreground-600 text-[13px]">
            총 {totalProducts}개의 상품이 있습니다.
          </span>
        </div>
      </div>
      {/* product list section */}
      {products.length > 0 ? <ProductList products={products} /> : <EmptySearchResult />}
      {/* pagination */}
      <ProductListPagination totalPages={totalPages} />
    </section>
  );
};

export default ProductSearchResultView;
