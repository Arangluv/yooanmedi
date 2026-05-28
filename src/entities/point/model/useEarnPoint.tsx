'use client';

import { useEffect, useState } from 'react';
import type { CartItem } from '@/entities/cart/@x/point';
import { PointCalculator } from '../libs/point-calculator';
import { PointTransactionMapper } from '../mapper';
import { PAYMENTS_METHOD } from '@/shared';

const useEarnPoint = ({ cartItems }: { cartItems: CartItem[] }) => {
  const [cardPoint, setCardPoint] = useState(0);
  const [bankPoint, setBankPoint] = useState(0);

  useEffect(() => {
    const pointItems = PointTransactionMapper.cartItemListToPointItemList(cartItems);
    setCardPoint(PointCalculator.totalForCart(pointItems, PAYMENTS_METHOD.credit_card));
    setBankPoint(PointCalculator.totalForCart(pointItems, PAYMENTS_METHOD.bank_transfer));
  }, [cartItems]);

  return { cardPoint, bankPoint };
};

export default useEarnPoint;
