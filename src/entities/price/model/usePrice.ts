'use client';

import { useEffect, useState } from 'react';
import {
  getOriginalPriceFromCartItems,
  getDeliveryFeeFromCartItems,
  getDiscountedDeliveryFeeFromCartItems,
} from '../lib/calculator';
import { CartItem } from '@/entities/cart';

type UsePriceProps = {
  cartItems: CartItem[];
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
 * TODO:: 해당 부분 리팩토링이 필요합니다
 * 할인을 제외한 총 상품금액(originalPrice)
 * 적용된 할인 금액(discountedPrice)
 * 결제 금액(payablePrice)
 * 할인 적용 여부(discountFlg)
 */
const usePrice = ({ cartItems, minOrderPrice }: UsePriceProps): UsePriceReturn => {
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [originalDeliveryFee, setOriginalDeliveryFee] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [payablePrice, setPayablePrice] = useState<number>(0);
  const [discountFlg, setDiscountFlg] = useState<boolean>(false);

  useEffect(() => {
    const originalPrice = getOriginalPriceFromCartItems({ cartItems });
    const originalDeliveryFee = getDeliveryFeeFromCartItems({ cartItems });
    const discountedDeliveryFee = getDiscountedDeliveryFeeFromCartItems({
      cartItems,
      minOrderPrice,
    });

    setOriginalPrice(originalPrice);
    setOriginalDeliveryFee(originalDeliveryFee);
    setDiscountedPrice(discountedDeliveryFee);
    setPayablePrice(originalPrice + originalDeliveryFee - discountedDeliveryFee);
    setDiscountFlg(originalPrice >= minOrderPrice && discountedDeliveryFee > 0);
  }, [cartItems, minOrderPrice]);

  return { originalPrice, originalDeliveryFee, discountedPrice, payablePrice, discountFlg };
};

export default usePrice;
