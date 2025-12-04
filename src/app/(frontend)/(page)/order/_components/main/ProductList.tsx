'use client'

import { Pagination } from '@heroui/react'
import ProductItem from './ProductItem'

export default function ProductList() {
  return (
    <section className="w-full flex items-center justify-center mt-16">
      <div className="w-full max-w-5xl flex flex-col gap-16">
        <RankingSection />
        <AllProductSection />
        <ListPagination />
      </div>
    </section>
  )
}

function RankingSection() {
  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        실시간 <span className="text-brand">인기상품</span>
      </h2>
      {/* 인기상품 리스트 섹션 */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
      </div>
    </div>
  )
}

function AllProductSection() {
  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <span className="text-brand">전체상품</span> 살펴보기
      </h2>
      {/* 인기상품 리스트 섹션 */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-8">
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
      </div>
    </div>
  )
}

// pagination component
function ListPagination() {
  return (
    <div className="w-full flex justify-center">
      <Pagination
        total={10}
        showControls
        page={1}
        onChange={(page) => console.log(page)}
        className="cursor-pointer"
      />
    </div>
  )
}
