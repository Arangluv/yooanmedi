'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { CartItem } from '@/entities/cart';
import { getMaxPointOnPurchase } from '@/entities/point';
import { usePrice } from '@/entities/price';
import { formatNumberWithCommas, useSiteMetaStore } from '@/shared';
import { useCartQuery } from '@/entities/cart';

const OrderList = () => {
  const {
    result: { data },
  } = useCartQuery();

  const { minOrderPrice } = useSiteMetaStore();
  const { discountFlg } = usePrice({ cartItems: data.items, minOrderPrice }); // 최소주문금액 만족 여부 확인

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xl font-bold">주문 리스트</span>
      {data.items.length > 0 ? (
        <div className="border-foreground-200 flex w-full flex-col gap-3 rounded-lg border-1 p-3">
          {data.items.map((item) => (
            <OrderListItem key={item.product.id} cartItem={item} discountFlg={discountFlg} />
          ))}
        </div>
      ) : (
        <EmptyOrderList />
      )}
    </div>
  );
};

const EmptyOrderList = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 py-6">
      <span className="text-foreground-600 text-sm">장바구니에 담긴 상품이 없습니다.</span>
      <Link href="/order" className="text-brand text-[15px] font-bold">
        상품 둘러보기
      </Link>
    </div>
  );
};

const OrderListItem = ({ cartItem, discountFlg }: { cartItem: CartItem; discountFlg: boolean }) => {
  return (
    <div className="flex items-center gap-4">
      {/* 상품 이미지 */}
      <div className="border-foreground-200 flex h-16 w-16 items-center justify-center overflow-hidden rounded-sm border-1 bg-neutral-50">
        {/* TODO :: 해당 부분 개선 */}
        {cartItem?.product?.image ? (
          <Image
            src={cartItem.product.image.url}
            alt={'상품 이미지'}
            width={64}
            height={64}
            className="h-full w-full object-contain"
            unoptimized={true}
          />
        ) : (
          <ImageIcon className="text-foreground-300 h-6 w-6" strokeWidth={1.5} />
        )}
      </div>
      {/* 상품 정보 */}
      <div className="flex flex-col">
        <span>{cartItem.product.name}</span>
        <div className="text-foreground-600 flex gap-1 text-[13px]">
          <span>수량 {cartItem.quantity}개</span>
          <span>|</span>
          <DeliveryFeePart cartItem={cartItem} discountFlg={discountFlg} />
          <span>|</span>
          <span>{cartItem.product.returnable ? '반품가능' : '반품불가'}</span>
        </div>
        <span className="text-brand text-[13px]">
          구매 시 최대 적립금 {getMaxPointOnPurchase(cartItem.product)}원
        </span>
      </div>
    </div>
  );
};

const DeliveryFeePart = ({
  cartItem,
  discountFlg,
}: {
  cartItem: CartItem;
  discountFlg: boolean;
}) => {
  if (cartItem.product.is_free_delivery && discountFlg) {
    return <span>배송비 무료</span>;
  }

  return (
    <span className="flex items-center gap-1">
      <span>배송비 {formatNumberWithCommas(cartItem.product.delivery_fee)}원</span>
      <span className="text-brandWeek text-[13px] font-bold">
        {cartItem.product.is_cost_per_unit ? '(수량 당)' : ''}
      </span>
    </span>
  );
};

export default OrderList;
