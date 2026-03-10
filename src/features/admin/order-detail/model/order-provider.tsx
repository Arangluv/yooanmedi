'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { normalizeOrderData, type CollectionViewOrderData } from '../lib/normalize';
import { getOrderDetailById } from '../lib/get-order-detail-by-id';
import { placeholderData } from '../config/placeholder-data';

type OrderCollectionContextProps = {
  orderInfo: CollectionViewOrderData['orderInfo'];
  paymentInfo: CollectionViewOrderData['paymentInfo'];
  orderUserInfo: CollectionViewOrderData['orderUserInfo'];
  deliveryInfo: CollectionViewOrderData['deliveryInfo'];
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

  const value = useMemo(() => {
    const normalizedData = orderDetailData ? normalizeOrderData(orderDetailData) : placeholderData;

    return {
      orderInfo: normalizedData.orderInfo,
      paymentInfo: normalizedData.paymentInfo,
      orderUserInfo: normalizedData.orderUserInfo,
      deliveryInfo: normalizedData.deliveryInfo,
    };
  }, [orderDetailData]);

  return (
    <OrderCollectionContext.Provider value={value}>{children}</OrderCollectionContext.Provider>
  );
};
