'use client'

import Link from 'next/link'
import ProductItem from './ProductItem'
import ProductListPagination from './Pagination'
import { ProductItemType } from '../../_type'
import { SearchX, Search, CircleArrowRight } from 'lucide-react'

export default function SearchResultList({
  products,
  totalPages,
  condition,
  totalProducts,
}: {
  products: ProductItemType[]
  totalPages: number
  condition: 'pn' | 'cn'
  totalProducts: number
}) {
  return (
    <section className="w-5xl flex flex-col mt-16 flex-shrink-0">
      {/* 검색결과 타이틀 */}
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground-800 flex gap-1 items-center mb-4">
          <Search className="w-6 h-6 text-brandWeek" />
          검색결과
        </h2>
        <Link
          href="/order"
          className="text-brand font-bold flex items-center gap-1 hover:text-brandWeek transition-colors duration-300"
        >
          전체상품 보기
          <CircleArrowRight className="w-4 h-4 text-brandWeek" />
        </Link>
      </div>
      {/* sort section */}
      <div className="flex justify-between px-4 py-2 bg-neutral-50 border-t-1 border-foreground-300 mb-8">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <span className="text-brandWeek font-bold">
              {condition === 'pn' ? '상품명' : '제약사명'}
            </span>
            <span>으로 검색한</span>
          </div>
          <span className="text-brandWeek font-bold">"ㅁㅁㅁ"</span>에 대한 검색결과
        </div>
        <div>
          <span className="text-[13px] text-foreground-600">
            총 {totalProducts}개의 상품이 있습니다.
          </span>
        </div>
      </div>
      {/* 상품 리스트 */}
      {products.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 mb-10">
          {products.map((item) => (
            <ProductItem key={item.id} productItem={item} />
          ))}
        </div>
      ) : (
        <SearchEmptyResult />
      )}
      {/* pagination */}
      <ProductListPagination totalPages={totalPages} />
    </section>
  )
}

function SearchEmptyResult() {
  return (
    <div className="w-full h-[300px] flex flex-col items-center justify-center gap-4 bg-neutral-50 rounded-lg p-4">
      <SearchX className="w-[100px] h-[100px] text-foreground-200" strokeWidth={1.5} />
      <span className="text-foreground-700 text-2xl font-bold leading-none">
        검색 결과가 없습니다.
      </span>
      <span className="text-foreground-600 text-sm">다른 검색어를 입력해주세요.</span>
    </div>
  )
}
