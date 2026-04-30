'use client';

import { Info } from 'lucide-react';

import { usePrice } from '@/entities/price';
import { formatNumberWithCommas } from '@/shared';
import { useCartQuery } from '../model/hooks/useCartQuery';

// TODO :: minOrderPrice 로직이 변경되면 props 삭제 필요할수도있음
const DiscountAlertBox = ({ minOrderPrice }: { minOrderPrice: number }) => {
  const { result } = useCartQuery();
  const { discountFlg } = usePrice({ cartItems: result.data.items, minOrderPrice });

  if (!discountFlg) {
    return null;
  }

  return (
    <div className="bg-brandWeek/10 mt-4 flex items-center justify-end gap-1 rounded-md p-2">
      <Info className="text-brand h-4 w-4" />
      <span className="text-brand text-sm">
        주문금액 {`${formatNumberWithCommas(minOrderPrice)}`}원 이상 고객 혜택으로 배송비 할인이
        적용되었어요
      </span>
    </div>
  );
};

export default DiscountAlertBox;
