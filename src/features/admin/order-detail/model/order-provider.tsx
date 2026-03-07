'use client';

import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { normalizeOrderData, type CollectionViewOrderData } from '../lib/normalize';
import { getOrderDetailById } from '../lib/get-order-detail-by-id';

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
    throw new Error('useOrderCollection는 OrderCollectionProvider 내에서만 사용할 수 있습니다.');
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
  const { data: orderDetailData } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetailById(orderId),
    enabled: !!orderId,
  });

  const normalizedOrderData = useMemo(() => {
    return normalizeOrderData(orderDetailData);
  }, [orderDetailData]);

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
