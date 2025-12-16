'use client'

import Image from 'next/image'
import { Button, Divider, Form } from '@heroui/react'
import { clsx } from 'clsx'
import { NumberInput } from '@heroui/react'
import {
  InventoryContext,
  OrderUserInfoContext,
  ProductInfoContext,
} from '@order/_context/order_context'
import { useContext, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { ProductItemType } from '../../_type'
import { formatNumberWithCommas, getPointOnPurchase } from '../../utils'
import { AddedProductToast, ExistingProductToast } from './ToastComponents'
import { toast } from 'sonner'
import { getCurrentUserOrderHistory } from '../../actions'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'

export default function ProductDeatilAsideSection() {
  const { clickedProduct } = useContext(ProductInfoContext)
  const { inventory, setInventory } = useContext(InventoryContext)
  const { user } = useContext(OrderUserInfoContext)

  return clickedProduct ? (
    <SelectedProductDetailSection
      product={clickedProduct}
      inventory={inventory}
      setInventory={setInventory}
      user={user}
    />
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
          <ProductDetailEmptySection name="상품명" />
          <ProductDetailEmptySection name="제조사" />
          <ProductDetailEmptySection name="규격" />
          <ProductDetailEmptySection name="가격" />
          <ProductDetailEmptySection name="보험코드" />
          <ProductDetailEmptySection name="재고" />
        </div>
      </div>
    </div>
  )
}

function SelectedProductDetailSection({
  product,
  inventory,
  setInventory,
  user,
}: {
  product: ProductItemType
  inventory: Array<{
    product: ProductItemType
    quantity: number
  }>
  setInventory: (
    inventory: Array<{
      product: ProductItemType
      quantity: number
    }>,
  ) => void
  user: any
}) {
  const {
    id,
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
            {product.image?.url ? (
              <Image
                src={product.image.url}
                alt={product.image.alt ?? ''}
                width={150}
                height={150}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <ImageIcon className="w-6 h-6 text-foreground-300" strokeWidth={1.5} />
                <span className="text-sm text-foreground-600">상품 이미지를 준비중입니다.</span>
              </div>
            )}
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
          <ProductPurchaseHistorySection prod_id={id} user_id={user.id} />
          <Divider className="my-2" />
          <ProductPointBenefitSection price={price} rate={cashback_rate} />
          <ProductQuantityInput
            inventory={inventory}
            setInventory={setInventory}
            product={product}
          />
        </div>
      </div>
    </div>
  )
}

function ProductDetailEmptySection({ name }: { name: string }) {
  return (
    <div className="flex gap-2 items-start text-sm text-foreground-600">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{name}</span>
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

function ProductQuantityInput({
  inventory,
  setInventory,
  product,
}: {
  inventory: Array<{
    product: ProductItemType
    quantity: number
  }>
  setInventory: (
    inventory: Array<{
      product: ProductItemType
      quantity: number
    }>,
  ) => void
  product: ProductItemType
}) {
  const [value, setValue] = useState<number>(0)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { quantity } = Object.fromEntries(new FormData(e.target as HTMLFormElement))

    if (value < 1 || value > 999) {
      toast.error('주문수량은 1 이상 999 이하이어야 합니다.')
      setValue(0)
      return
    }

    const isUserAdded = inventory.some((item) => item.product.id === product.id)

    if (isUserAdded) {
      toast.info(<ExistingProductToast />)
      setValue(0)
      return
    } else {
      const newInventory = [...inventory, { product, quantity: Number(quantity) }]
      setInventory(newInventory)
      setValue(0)
      toast.success(<AddedProductToast count={Number(quantity)} />)
    }
  }

  const handlePressBtn = () => {
    const isUserAdded = inventory.some((item) => item.product.id === product.id)

    if (value < 1 || value > 999) {
      toast.error('주문수량은 1 이상 999 이하이어야 합니다.')
      setValue(0)
      return
    }

    if (isUserAdded) {
      toast.info(<ExistingProductToast />)
      return
    }

    const newInventory = [...inventory, { product, quantity: value }]
    setInventory(newInventory)
    setValue(0)
    toast.success(<AddedProductToast count={value} />)
  }

  return (
    <Form
      className="flex gap-2 items-start text-sm text-foreground-600 mt-2"
      onSubmit={onSubmit}
      validationBehavior="native"
    >
      <span className="text-foreground-700 flex-shrink-0 w-[100px]">주문수량</span>
      <div className="flex items-start w-full gap-2">
        <NumberInput
          aria-label="주문수량"
          size="sm"
          hideStepper
          radius="sm"
          name="quantity"
          defaultValue={0}
          value={value}
          // @ts-ignore
          onChange={(e) => setValue(Number(e.target.value))}
          validate={(value) => {
            if (!value) {
              return '주문수량을 입력해주세요.'
            }

            if (value < 1 || value > 999) {
              return '주문수량은 1 이상 999 이하이어야 합니다.'
            }

            return true
          }}
          variant="bordered"
          description="입력 후 Enter를 눌러주세요."
          classNames={{
            inputWrapper: 'h-8 border-[1px]',
            description: 'text-sm text-warning',
            input: 'text-right',
          }}
        />
        <Button size="sm" radius="sm" className="bg-brand text-white" onPress={handlePressBtn}>
          확인
        </Button>
      </div>
    </Form>
  )
}

function ProductPurchaseHistorySection({ prod_id, user_id }: { prod_id: number; user_id: number }) {
  const { data } = useQuery({
    queryKey: ['order-history', prod_id, user_id],
    queryFn: () => getCurrentUserOrderHistory({ prod_id, user_id }),
  })

  if (!data || data.length === 0) {
    return null
  }

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
          {data?.map((item) => (
            <tr key={item.id} className="text-xs border-1 border-foreground-200">
              <td className="text-center py-1 border-r-1 border-foreground-200">
                {moment(item.orderCreatedAt).format('YYYY-MM-DD')}
              </td>
              <td className="text-center border-r-1 border-foreground-200">{item.quantity}</td>
              {/* @ts-ignore */}
              <td className="text-center">{formatNumberWithCommas(item.product.price)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
