'use client';

import { useEffect, useState } from 'react';

import type { Inventory } from '@/entities/inventory/@x/point';

import {
  getTotalPointWhenUsingCardPayments,
  getTotalPointWhenUsingBankTransfer,
} from '../lib/calculator';

const useEarnPoint = ({ inventory }: { inventory: Inventory }) => {
  const [cardPoint, setCardPoint] = useState(0);
  const [bankPoint, setBankPoint] = useState(0);

  useEffect(() => {
    setCardPoint(getTotalPointWhenUsingCardPayments(inventory));
    setBankPoint(getTotalPointWhenUsingBankTransfer(inventory));
  }, [inventory]);

  return { cardPoint, bankPoint };
};

export default useEarnPoint;
