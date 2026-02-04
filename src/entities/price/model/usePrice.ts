'use client';

import { useEffect, useState } from 'react';

import type { Inventory } from '@/entities/inventory/@x/price';

import {
  getOriginalPriceFromInventory,
  getDeliveryFeeFromInventory,
  getDiscountedDeliveryFeeFromInventory,
} from '../lib/calculator';
// TODO :: useReducer로 관리하는 것이 좋을 것 같음

type UsePriceProps = {
  inventory: Inventory;
  minOrderPrice: number;
};

type UsePriceReturn = {
  originalPrice: number;
  originalDeliveryFee: number;
  discountedPrice: number;
  payablePrice: number;
  discountFlg: boolean;
};

/**
 * 할인을 제외한 총 상품금액(originalPrice)
 * 적용된 할인 금액(discountedPrice)
 * 결제 금액(payablePrice)
 * 할인 적용 여부(discountFlg)
 */
const usePrice = ({ inventory, minOrderPrice }: UsePriceProps): UsePriceReturn => {
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [originalDeliveryFee, setOriginalDeliveryFee] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [payablePrice, setPayablePrice] = useState<number>(0);
  const [discountFlg, setDiscountFlg] = useState<boolean>(false);

  useEffect(() => {
    const originalPrice = getOriginalPriceFromInventory({ inventory });
    const originalDeliveryFee = getDeliveryFeeFromInventory({ inventory });
    const discountedDeliveryFee = getDiscountedDeliveryFeeFromInventory({
      inventory,
      minOrderPrice,
    });

    setOriginalPrice(originalPrice);
    setOriginalDeliveryFee(originalDeliveryFee);
    setDiscountedPrice(originalPrice + originalDeliveryFee - discountedDeliveryFee);
    setPayablePrice(originalPrice + originalDeliveryFee - discountedDeliveryFee);
    setDiscountFlg(originalPrice >= minOrderPrice && discountedDeliveryFee > 0);
  }, [inventory, minOrderPrice]);

  return { originalPrice, originalDeliveryFee, discountedPrice, payablePrice, discountFlg };
};

export default usePrice;
