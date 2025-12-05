'use client'

import Image from 'next/image'
import { BrandLogo } from '@/config/Logo'
import Link from 'next/link'
import SearchForm from './_components/main/SearchForm'
import MainIconImage1 from '@public/order/main-icon-1.png'
import MainIconImage2 from '@public/order/main-icon-2.png'
import MainIconImage3 from '@public/order/main-icon-3.png'
import SearchResultList from './_components/main/SearchResultList'
import ProductList from './_components/main/ProductList'
import { Button, Divider } from '@heroui/react'
import clsx from 'clsx'
import { NumberInput } from '@heroui/react'
import { Minus, Plus } from 'lucide-react'
import Inventory from './_components/main/Inventory'
import TestImage from '@public/order/order_test.webp'
import CategoryNav from './_components/main/CategoryNav'

export default function OrderPage() {
  return (
    <div className="flex flex-col w-full h-full items-center min-h-screen">
      <Order />
    </div>
  )
}

function Order() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white z-10 py-6 sticky top-0">
        <header className="w-full h-full relative">
          <Link href="/order" prefetch={false}>
            <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
          </Link>
          {/* search area */}
          <SearchForm />
        </header>
      </div>
      {/* divider */}
      <div className="w-full h-[1px] bg-foreground-200 mb-4"></div>
      {/* bottom area */}
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between w-full">
          {/* 제품카테고리 */}
          <CategoryNav />
          {/* 주문서확인 및 주문하기 */}
          <div className="flex gap-6 text-lg">
            <Link href="/order" className="text-brandWeek font-bold">
              약품주문
            </Link>
            <Link href="/order/history" className="text-foreground-600">
              주문내역확인
            </Link>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="w-[calc((100%-1024px)/2)]"></div>
        {/* <ProductList /> */}
        <SearchResultList />
        <ProductAsideSection />
      </div>
      <Inventory />
    </div>
  )
}

function ProductAsideSection() {
  return (
    <div className="w-[calc((100%-1024px)/2)] px-8 flex flex-col gap-8 fixed top-[148px] right-0">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex flex-col gap-4 w-full max-w-[400px] p-4 rounded-lg"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="w-full h-[150px] bg-neutral-100 mb-4 rounded-md overflow-hidden">
            <Image src={TestImage} alt="test" className="w-full h-full object-contain" />
          </div>
          <ProductDetailSection name="상품이름" value="테타불린에스앤주PFS" />
          <ProductDetailSection name="제조사" value="삼성바이오에피스(주)" />
          <ProductDetailSection name="가격" value="106,000원" />
          <ProductDetailSection name="규격" value="1ml / 1관" />
          <ProductDetailSection name="보험코드" value="654400681" />
          <ProductDetailSection name="배송비" value="4,000원" />
          <ProductDetailSection name="재고" value="재고 있음" accent="brand" />
          <ProductDetailSection name="반품가능여부" value="반품 불가능" accent="danger" />
          <ProductPurchaseHistorySection />
          <Divider className="my-2" />
          <ProductDetailSection
            name="결제혜택"
            value="적립금 1,060원"
            accent="brand"
            isBold={true}
          />
          <ProductQuantityInput />
        </div>
      </div>
    </div>
  )
}

function ProductDetailSection({
  name,
  value,
  accent = 'default',
  isBold = false,
}: {
  name: string
  value: string
  accent?: 'brand' | 'danger' | 'default'
  isBold?: boolean
}) {
  const accentColor =
    accent === 'brand'
      ? 'text-brandWeek'
      : accent === 'danger'
        ? 'text-danger'
        : 'text-foreground-600'

  const fontWeight = isBold ? 'font-bold' : 'font-normal'

  return (
    <div className="flex gap-2 items-center text-sm text-foreground-600">
      <span className="text-foreground-700 block w-[100px]">{name}</span>
      <span className={clsx(accentColor, fontWeight)}>{value}</span>
    </div>
  )
}

function ProductQuantityInput() {
  return (
    <div className="flex gap-2 items-start text-sm text-foreground-600 mt-2">
      <span className="text-foreground-700 flex-shrink-0 w-[100px]">주문수량</span>
      <div className="flex items-center">
        <NumberInput
          size="sm"
          value={1}
          hideStepper
          radius="sm"
          variant="bordered"
          description="입력 후 Enter를 눌러주세요."
          classNames={{
            inputWrapper: 'h-8 border-[1px]',
            description: 'text-sm text-warning',
          }}
        />
      </div>
    </div>
  )
}

function ProductPurchaseHistorySection() {
  return (
    <div className="flex gap-2 items-start text-sm text-foreground-600">
      <span className="text-foreground-700 flex-shrink-0 w-[100px]">최근 구매내역</span>
      <table className="w-full">
        <thead>
          <tr className="bg-neutral-100 text-sm border-1 border-foreground-200">
            <th className="border-r-1 border-foreground-200">구매일시</th>
            <th className="border-r-1 border-foreground-200">수량</th>
            <th>단가</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-1 border-foreground-200">
            <td className="text-center py-1 border-r-1 border-foreground-200">2025-12-05</td>
            <td className="text-center border-r-1 border-foreground-200">10</td>
            <td className="text-center">106,000원</td>
          </tr>
          <tr className="text-xs border-1 border-foreground-200">
            <td className="text-center py-1 border-r-1 border-foreground-200">2025-12-05</td>
            <td className="text-center border-r-1 border-foreground-200">10</td>
            <td className="text-center">106,000원</td>
          </tr>
          <tr className="text-xs border-1 border-foreground-200">
            <td className="text-center py-1 border-r-1 border-foreground-200">2025-12-05</td>
            <td className="text-center border-r-1 border-foreground-200">10</td>
            <td className="text-center">106,000원</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ProductListSection() {
  return <div className="w-full flex flex-col"></div>
}
