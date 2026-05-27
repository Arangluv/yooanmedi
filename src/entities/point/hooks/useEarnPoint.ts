import { useEffect, useState } from 'react';
import { CartItem } from '@/entities/cart/@x/point';
import { PointCalculator } from '../lib/calculator';
import { PAYMENTS_METHOD } from '@/shared';
import { PointTransactionMapper } from '../mapper';

export const useEarnPoint = ({ cartItems }: { cartItems: CartItem[] }) => {
  const [cardPoint, setCardPoint] = useState(0);
  const [bankPoint, setBankPoint] = useState(0);

  useEffect(() => {
    const pointItems = PointTransactionMapper.cartItemListToPointItemList(cartItems);

    setCardPoint(PointCalculator.totalForCart(pointItems, PAYMENTS_METHOD.credit_card));
    setBankPoint(PointCalculator.totalForCart(pointItems, PAYMENTS_METHOD.credit_card));
  }, [cartItems]);

  return { cardPoint, bankPoint };
};
