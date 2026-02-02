'use client';

import { Divider, Textarea } from '@heroui/react';
import {
  formatNumberWithCommas,
  getMaxPointOnPurchase,
  getPointOnPurchase,
} from '@/app/(frontend)/(page)/order/utils';
import {
  InventoryContext,
  MinOrderPriceContext,
  OrderUserInfoContext,
} from '@/app/(frontend)/(page)/order/_context/order_context';
import { Fragment, useContext } from 'react';
import { ProductItemType } from '@/app/(frontend)/(page)/order/_type';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

export function UserInfoSection() {
  const { user } = useContext(OrderUserInfoContext);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xl font-bold">주문자 정보</span>
      <div className="flex w-full flex-col gap-1 rounded-lg bg-neutral-50 p-6">
        <div className="bg-brand mb-2 w-fit rounded-full px-3 py-1 text-xs text-white">
          기본배송지
        </div>
        <span className="text-foreground-700">{user.address}</span>
        <span className="text-foreground-700">{user.phoneNumber}</span>
        <span className="text-foreground-700">{user.email}</span>
      </div>
    </div>
  );
}

export function DeliveryRequestSection({
  userRequest,
  setUserRequest,
}: {
  userRequest: string;
  setUserRequest: (request: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
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
  );
}

export function PaymentsListSection() {
  const { inventory } = useContext(InventoryContext);
  const { minOrderPrice } = useContext(MinOrderPriceContext);
  const totalPrice = inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xl font-bold">결제 항목</span>
      {inventory.length > 0 ? (
        <div className="border-foreground-200 flex w-full flex-col gap-3 rounded-lg border-1 p-3">
          {inventory.map((item, index) => {
            if (index === inventory.length - 1) {
              return (
                <PaymentsListItem
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  isFreeDelivery={item.product.is_free_delivery && totalPrice >= minOrderPrice}
                />
              );
            } else {
              return (
                <Fragment key={item.product.id}>
                  <PaymentsListItem
                    product={item.product}
                    quantity={item.quantity}
                    isFreeDelivery={item.product.is_free_delivery && totalPrice >= minOrderPrice}
                  />
                  <Divider />
                </Fragment>
              );
            }
          })}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 py-6">
          <span className="text-foreground-600 text-sm">장바구니에 담긴 상품이 없습니다.</span>
          <Link href="/order" className="text-brand text-[15px] font-bold">
            상품 둘러보기
          </Link>
        </div>
      )}
    </div>
  );
}

function PaymentsListItem({
  product,
  quantity,
  isFreeDelivery,
}: {
  product: ProductItemType;
  quantity: number;
  isFreeDelivery: boolean;
}) {
  if (!product) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {/* 이미지 */}
      <div className="border-foreground-200 flex h-16 w-16 items-center justify-center overflow-hidden rounded-sm border-1 bg-neutral-50">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.image.alt ?? ''}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            unoptimized={true}
          />
        ) : (
          <ImageIcon className="text-foreground-300 h-6 w-6" strokeWidth={1.5} />
        )}
      </div>
      {/* 상품 정보 */}
      <div className="flex flex-col">
        <span>{product.name}</span>
        <div className="text-foreground-600 flex gap-1 text-[13px]">
          <span>수량 {quantity}개</span>
          <span>|</span>
          <DeliveryFeePart product={product} isFreeDelivery={isFreeDelivery} />
          <span>|</span>
          <span>{product.returnable ? '반품가능' : '반품불가'}</span>
        </div>
        <span className="text-brand text-[13px]">
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
  );
}

function DeliveryFeePart({
  product,
  isFreeDelivery,
}: {
  product: ProductItemType;
  isFreeDelivery: boolean;
}) {
  if (isFreeDelivery) {
    return (
      <span className="flex items-center gap-1">
        <span>배송비 무료</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <span>배송비 {formatNumberWithCommas(product.delivery_fee)}원</span>
      <span className="text-brandWeek text-[13px] font-bold">
        {product.is_cost_per_unit ? '(수량 당)' : ''}
      </span>
    </span>
  );
}
