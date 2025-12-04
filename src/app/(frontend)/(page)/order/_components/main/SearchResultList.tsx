'use client'

import Link from 'next/link'
import ProductItem from './ProductItem'
import ProductListPagination from './Pagination'

export default function SearchResultList() {
  const temp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-5xl flex flex-col mt-16 gap-4">
        {/* 검색결과 타이틀 */}
        <div>
          <span className="text-brandWeek font-bold">"ㅁㅁㅁ"</span>에 대한 검색결과
        </div>
        {/* sort section */}
        <div className="flex justify-between px-4 py-2 bg-neutral-50">
          <div className="flex gap-3 text-sm text-foreground-600 items-center">
            <Link href="/order" className="font-bold text-brand">
              낮은 가격순
            </Link>
            <span className="w-[1px] h-full bg-foreground-200"></span>
            <Link href="/order" className="hover:text-brandWeek transition-colors duration-300">
              높은 가격순
            </Link>
            <span className="w-[1px] h-full bg-foreground-200"></span>
            <Link href="/order" className="hover:text-brandWeek transition-colors duration-300">
              판매량순
            </Link>
          </div>
          <div>
            <span className="text-[13px] text-foreground-600">총 100건의 검색결과가 있습니다.</span>
          </div>
        </div>
        {/* 상품 리스트 */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 mb-10">
          {temp.map((item) => (
            <ProductItem key={item} />
          ))}
        </div>
        {/* pagination */}
        <ProductListPagination />
      </div>
    </section>
  )
}
