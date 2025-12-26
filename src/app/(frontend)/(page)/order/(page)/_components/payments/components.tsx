'use client'

import { Divider, Textarea } from '@heroui/react'
import { formatNumberWithCommas, getMaxPointOnPurchase, getPointOnPurchase } from '@order/utils'
import { InventoryContext, OrderUserInfoContext } from '@order/_context/order_context'
import { Fragment, useContext } from 'react'
import { ProductItemType } from '@order/_type'
import Image from 'next/image'
import Link from 'next/link'

export function UserInfoSection() {
  const { user } = useContext(OrderUserInfoContext)

  if (!user) {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xl font-bold">주문자 정보</span>
      <div className="w-full flex flex-col p-6 gap-1 bg-neutral-50 rounded-lg">
        <div className="px-3 py-1 bg-brand rounded-full text-xs text-white w-fit mb-2">
          기본배송지
        </div>
        <span className="text-foreground-700">{user.address}</span>
        <span className="text-foreground-700">{user.phoneNumber}</span>
        <span className="text-foreground-700">{user.email}</span>
      </div>
    </div>
  )
}

export function DeliveryRequestSection({
  userRequest,
  setUserRequest,
}: {
  userRequest: string
  setUserRequest: (request: string) => void
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xl font-bold">배송 요청 사항</span>
      <Textarea
        placeholder="배송 및 기타 요청 사항이 있으면 입력해주세요."
        radius="sm"
        variant="bordered"
        rows={8}
        value={userRequest}
        onChange={(e) => setUserRequest(e.target.value)}
        classNames={{ inputWrapper: 'border-1 border-foreground-200' }}
      />
    </div>
  )
}

export function PaymentsListSection() {
  const { inventory } = useContext(InventoryContext)

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xl font-bold">결제 항목</span>
      {inventory.length > 0 ? (
        <div className="w-full flex flex-col p-3 border-1 rounded-lg border-foreground-200 gap-3">
          {inventory.map((item, index) => {
            if (index === inventory.length - 1) {
              return (
                <PaymentsListItem
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                />
              )
            } else {
              return (
                <Fragment key={item.product.id}>
                  <PaymentsListItem product={item.product} quantity={item.quantity} />
                  <Divider />
                </Fragment>
              )
            }
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2 items-center justify-center py-6 bg-neutral-50 rounded-lg">
          <span className="text-foreground-600 text-sm">장바구니에 담긴 상품이 없습니다.</span>
          <Link href="/order" className="text-brand text-[15px] font-bold">
            상품 둘러보기
          </Link>
        </div>
      )}
    </div>
  )
}

function PaymentsListItem({ product, quantity }: { product: ProductItemType; quantity: number }) {
  if (!product) {
    return null
  }

  return (
    <div className="flex gap-4 items-center">
      {/* 이미지 */}
      <div className="w-16 h-16 bg-neutral-100 rounded-sm overflow-hidden border-1 border-foreground-200">
        <Image
          src={product.image.url}
          alt={product.image.alt ?? ''}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          unoptimized={true}
        />
      </div>
      {/* 상품 정보 */}
      <div className="flex flex-col">
        <span>{product.name}</span>
        <div className="flex gap-1 text-[13px] text-foreground-600">
          <span>수량 {quantity}개</span>
          <span>|</span>
          <span>배송비 {formatNumberWithCommas(product.delivery_fee)}원</span>
          <span>|</span>
          <span>{product.returnable ? '반품가능' : '반품불가'}</span>
        </div>
        <span className="text-[13px] text-brand">
          구매 시 최대 적립금{' '}
          {getMaxPointOnPurchase({
            price: product.price,
            cashback_rate: product.cashback_rate,
            cashback_rate_for_bank: product.cashback_rate_for_bank,
          })}
          원
        </span>
      </div>
    </div>
  )
}
