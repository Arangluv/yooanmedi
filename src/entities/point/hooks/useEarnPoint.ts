import { useEffect, useState } from 'react';
import { CartItem } from '@/entities/cart/@x/point';
import {
  getTotalPointWhenUsingCardPayments,
  getTotalPointWhenUsingBankTransfer,
} from '../lib/calculator';

export const useEarnPoint = ({ cartItems }: { cartItems: CartItem[] }) => {
  const [cardPoint, setCardPoint] = useState(0);
  const [bankPoint, setBankPoint] = useState(0);

  useEffect(() => {
    setCardPoint(getTotalPointWhenUsingCardPayments(cartItems));
    setBankPoint(getTotalPointWhenUsingBankTransfer(cartItems));
  }, [cartItems]);

  return { cardPoint, bankPoint };
};
