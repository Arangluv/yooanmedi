'use client'

import Image from 'next/image'
import TestImage from '@public/order/order_test.webp'
import { Divider } from '@heroui/react'
import { clsx } from 'clsx'
import { NumberInput } from '@heroui/react'
import { ProductInfoContext } from '@order/_context/order_context'
import { useContext } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { ProductItemType } from '../../_type'
import { formatNumberWithCommas, getPointOnPurchase } from '../../utils'

export default function ProductDeatilAsideSection() {
  const { clickedProduct } = useContext(ProductInfoContext)

  return clickedProduct ? (
    <SelectedProductDetailSection product={clickedProduct} />
  ) : (
    <EmptyProductDetailSection />
  )
}

function EmptyProductDetailSection() {
  return (
    <div className="w-[calc((100%-1024px)/2)] px-8 flex flex-col gap-8 fixed top-[148px] right-0">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex flex-col gap-4 w-full max-w-[400px] p-4 rounded-lg bg-white"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="w-full h-[150px] bg-neutral-100 mb-4 rounded-md overflow-hidden flex items-center justify-center gap-2">
            <ImageIcon className="w-6 h-6 text-foreground-200" />
            <span className="text-sm text-foreground-600">상품을 선택해주세요.</span>
          </div>
          <ProductDetailSection name="상품명" value="" />
          <ProductDetailSection name="제조사" value="" />
          <ProductDetailSection name="규격" value="" />
          <ProductDetailSection name="가격" value="" />
          <ProductDetailSection name="보험코드" value="" />
          <ProductDetailSection name="재고" value="" accent="brand" />
        </div>
      </div>
    </div>
  )
}

function SelectedProductDetailSection({ product }: { product: ProductItemType }) {
  const {
    name,
    manufacturer,
    price,
    specification,
    insurance_code,
    stock,
    delivery_fee,
    cashback_rate,
    returnable,
  } = product
  console.log('product')
  console.log(product)

  return (
    <div className="w-[calc((100%-1024px)/2)] px-8 flex flex-col gap-8 fixed top-[148px] right-0">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex flex-col gap-4 w-full max-w-[400px] p-4 rounded-lg bg-white"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="w-full h-[150px] bg-neutral-100 mb-4 rounded-md overflow-hidden">
            <Image src={TestImage} alt="test" className="w-full h-full object-contain" />
          </div>
          <ProductDetailSection name="상품명" value={name} />
          <ProductDetailSection name="제조사" value={manufacturer} />
          <ProductDetailSection name="가격" value={`${formatNumberWithCommas(price)}원`} />
          <ProductDetailSection name="규격" value={specification ?? ''} />
          <ProductDetailSection name="보험코드" value={insurance_code ?? ''} />
          <ProductDetailSection name="배송비" value={`${formatNumberWithCommas(delivery_fee)}원`} />
          <ProductDetailSection
            name="재고"
            value={stock > 0 ? '재고 있음' : '재고 없음'}
            accent={stock > 0 ? 'brand' : 'danger'}
          />
          <ProductDetailSection
            name="반품가능여부"
            value={returnable ? '반품 가능' : '반품 불가능'}
            accent={returnable ? 'brand' : 'danger'}
          />
          <ProductPurchaseHistorySection />
          <Divider className="my-2" />
          <ProductPointBenefitSection price={price} rate={cashback_rate} />
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
  if (!value) {
    return null
  }

  const accentColor =
    accent === 'brand'
      ? 'text-brandWeek'
      : accent === 'danger'
        ? 'text-danger'
        : 'text-foreground-600'

  const fontWeight = isBold ? 'font-bold' : 'font-normal'

  return (
    <div className="flex gap-2 items-start text-sm text-foreground-600">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{name}</span>
      <span className={clsx(accentColor, fontWeight)}>{value}</span>
    </div>
  )
}

function ProductPointBenefitSection({ price, rate }: { price: number; rate: number }) {
  const willEarnPoint = getPointOnPurchase(price, rate)

  console.log('willEarnPoint')
  console.log(willEarnPoint)

  if (willEarnPoint === '0' || !willEarnPoint) {
    return null
  }

  return (
    <div className="flex gap-2 items-start text-sm text-foreground-600">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">결제혜택</span>
      <span className="text-brandWeek font-bold">적립금 {willEarnPoint}원</span>
    </div>
  )
}

function ProductQuantityInput() {
  return (
    <div className="flex gap-2 items-start text-sm text-foreground-600 mt-2">
      <span className="text-foreground-700 flex-shrink-0 w-[100px]">주문수량</span>
      <div className="flex items-center">
        <NumberInput
          aria-label="주문수량"
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
