'use client';

import { getCollectionOrderById } from '@/entities/order/api/collection-order';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';
import { normalizeOrderData } from '../lib/normalize';
import { CollectionViewOrderData } from '../lib/normalize';

type OrderCollectionContextProps = {
  orderInfo: CollectionViewOrderData['orderInfo'] | null;
  paymentInfo: CollectionViewOrderData['paymentInfo'] | null;
  orderUserInfo: CollectionViewOrderData['orderUserInfo'] | null;
  deliveryInfo: CollectionViewOrderData['deliveryInfo'] | null;
};

const OrderCollectionContext = createContext<OrderCollectionContextProps | null>(null);

export const useOrderCollection = () => {
  const context = useContext(OrderCollectionContext);

  if (!context) {
    throw new Error('useOrderCollection must be used within a OrderCollectionProvider');
  }

  return context;
};

export const OrderCollectionProvider = ({
  children,
  orderId,
}: {
  children: React.ReactNode;
  orderId: number;
}) => {
  const { data: rowOrderData } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getCollectionOrderById(orderId),
    enabled: !!orderId,
  });

  // TODO: 해당 부분 개선이 필요
  // UI에서 바뀌는 사용자 액션에 따라 바뀌는 부분은 orderInfo와 paymentInfo임 -> 나머지는 고정
  const normalizedOrderData = useMemo(() => {
    return normalizeOrderData(rowOrderData);
  }, [rowOrderData]);

  return (
    <OrderCollectionContext.Provider
      value={{
        orderInfo: normalizedOrderData?.orderInfo ?? null,
        paymentInfo: normalizedOrderData?.paymentInfo ?? null,
        orderUserInfo: normalizedOrderData?.orderUserInfo ?? null,
        deliveryInfo: normalizedOrderData?.deliveryInfo ?? null,
      }}
    >
      {children}
    </OrderCollectionContext.Provider>
  );
};
