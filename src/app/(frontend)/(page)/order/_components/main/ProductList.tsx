'use client'

import ProductItem from './ProductItem'
import ProductListPagination from './Pagination'

export default function ProductList() {
  return (
    <section className="w-5xl flex flex-col gap-16 mt-16 flex-shrink-0">
      <RankingSection />
      <AllProductSection />
      <ProductListPagination />
    </section>
  )
}

function RankingSection() {
  const temp = [1, 2, 3, 4, 5]

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      {/* 인기상품 리스트 섹션 */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        {temp.map((item) => (
          <ProductItem key={item} />
        ))}
      </div>
    </div>
  )
}

function AllProductSection() {
  const temp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <span className="text-brand">전체상품</span> 살펴보기
      </h2>
      {/* 인기상품 리스트 섹션 */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        {temp.map((item) => (
          <ProductItem key={item} />
        ))}
      </div>
    </div>
  )
}
