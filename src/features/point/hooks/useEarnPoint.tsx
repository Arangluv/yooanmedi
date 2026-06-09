'use client';

import { useEffect, useState } from 'react';
import { PAYMENTS_METHOD } from '@/shared';
import { CartItem } from '@/entities/cart-item/@x/point';
import { PointCalculator } from '@/entities/point';
import { PointFeatureMapper } from '../mapper';

export const useEarnPoint = ({ cartItems }: { cartItems: CartItem[] }) => {
  const [cardPoint, setCardPoint] = useState(0);
  const [bankPoint, setBankPoint] = useState(0);

  useEffect(() => {
    const pointItems = PointFeatureMapper.cartItemListToPointItemList(cartItems);

    setCardPoint(PointCalculator.totalForCart(pointItems, PAYMENTS_METHOD.credit_card));
    setBankPoint(PointCalculator.totalForCart(pointItems, PAYMENTS_METHOD.credit_card));
  }, [cartItems]);

  return { cardPoint, bankPoint };
};
