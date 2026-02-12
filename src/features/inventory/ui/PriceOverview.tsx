'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@heroui/react';

import { useInventoryStore } from '@/entities/inventory';
import { usePrice } from '@/entities/price';
import { formatNumberWithCommas } from '@/shared';

import DiscountAlertBox from './DiscountAlertBox';

const PriceOverview = ({ minOrderPrice }: { minOrderPrice: number }) => {
  const router = useRouter();
  const { inventory } = useInventoryStore();
  const { originalPrice, originalDeliveryFee, discountedPrice, payablePrice } = usePrice({
    inventory,
    minOrderPrice,
  });

  return (
    <div className="flex flex-col">
      <div className="bg-foreground-200 h-[1px] w-full"></div>
      <DiscountAlertBox minOrderPrice={minOrderPrice} />
      <div className="my-4 flex flex-col gap-6 bg-neutral-50 p-4">
        <span className="text-lg font-bold">주문 예상금액</span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span>총 상품금액</span>
            <span>{formatNumberWithCommas(originalPrice)}원</span>
          </div>
          <div className="flex justify-between">
            <span>총 배송비</span>
            <span>{formatNumberWithCommas(originalDeliveryFee)}원</span>
          </div>
          {/* 할인된 배송비 */}
          <div className="flex justify-between">
            <span className="text-brand">할인된 배송비</span>
            <span className="text-brand">-{formatNumberWithCommas(discountedPrice)}원</span>
          </div>
          <div className="bg-foreground-200 my-2 h-[1px] w-full"></div>
          <div className="flex justify-between">
            <span className="font-bold">총 결제금액</span>
            <span className="text-brandWeek font-bold">
              {formatNumberWithCommas(payablePrice)}원
            </span>
          </div>
        </div>
      </div>
      <Button
        className="bg-brand !h-[56px] text-white"
        size="lg"
        radius="sm"
        isDisabled={inventory.length === 0}
        onPress={() => router.push('/order/payments')}
      >
        총 {inventory?.length ?? 0}개의 상품 구매하기
      </Button>
    </div>
  );
};

export default PriceOverview;
