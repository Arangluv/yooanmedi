'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrrentUserOrder } from '../api/get-recent-purchases';

import type { User } from '@/entities/user/@x/order';
import type { ProductItem } from '@/entities/product/@x/order';

type UseRecentPurchasesProps = {
  user: User;
  product: ProductItem;
};

const useRecentPurchases = ({ user, product }: UseRecentPurchasesProps) => {
  const { data } = useQuery({
    queryKey: ['recent-purchases', user.id, product.id],
    queryFn: () => getCurrrentUserOrder({ user, product }),
  });

  return { data };
};

export default useRecentPurchases;
