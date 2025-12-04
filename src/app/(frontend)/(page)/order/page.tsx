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
      <div className="w-full h-[1px] bg-foreground-200 mb-6"></div>
      {/* bottom area */}
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between w-full">
          {/* 제품카테고리 */}
          <div className="flex gap-6">
            <Link
              href="/order"
              className="flex gap-1 items-center hover:text-brandWeek transition-colors duration-300"
            >
              <Image
                src={MainIconImage1}
                alt="의약품"
                width={26}
                height={26}
                className="w-[26px] h-[26px] object-contain"
              />
              <span>의약품</span>
            </Link>
            <Link
              href="/order"
              className="flex gap-1 items-center hover:text-brandWeek transition-colors duration-300"
            >
              <Image
                src={MainIconImage2}
                alt="주사"
                width={26}
                height={26}
                className="w-[26px] h-[26px] object-contain"
              />
              <span>주사</span>
            </Link>
            <Link
              href="/order"
              className="flex gap-1 items-center hover:text-brandWeek transition-colors duration-300"
            >
              <Image
                src={MainIconImage3}
                alt="에스테틱"
                width={26}
                height={26}
                className="w-[26px] h-[26px] object-contain"
              />
              <span>에스테틱</span>
            </Link>
          </div>
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
        <ProductList />
        <div className="w-[calc((100%-1024px)/2)] mt-16 px-8 flex flex-col gap-8 relative">
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
              <ProductDetailSection name="재고" value="재고 있음" accent="brand" />
              <ProductDetailSection name="반품가능여부" value="반품 불가능" accent="danger" />
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
          {/* 장바구니 */}
          {/* <div
            style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
            className="flex flex-col gap-4 w-full h-[250px] max-w-[400px] p-4 rounded-lg"
          >
            <span className="font-bold">장바구니(주문내역)</span>
            <table>
              <thead>
                <tr className="text-sm text-foreground-600 bg-neutral-100">
                  <th className="text-start border-1 border-foreground-200 pl-2">상품이름</th>
                  <th className="text-start border-1 border-foreground-200 pl-2">가격</th>
                  <th className="text-start border-1 border-foreground-200 pl-2">수량</th>
                  <th className="text-start border-1 border-foreground-200 pl-2">합계</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm text-foreground-600 border-1 border-foreground-200">
                  <td className="text-start pl-2 border-r-1 border-foreground-200">
                    테타불린에스앤주PFS
                  </td>
                  <td className="text-center border-r-1 border-foreground-200">106,000원</td>
                  <td className="text-center border-r-1 border-foreground-200">10</td>
                  <td className="text-end">1,060,000원</td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </div>
      {/* <SearchResultList /> */}
      <Inventory />
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

function ProductListSection() {
  return <div className="w-full flex flex-col"></div>
}
