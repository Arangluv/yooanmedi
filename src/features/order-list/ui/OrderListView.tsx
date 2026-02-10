'use client';

import { Divider } from '@heroui/react';

import OrderListTitle from './OrderListTitle';
import OrderListSearch from './OrderListSearch';
import OrderList from './OrderList';

import type { OrderListItem } from '../lib/normalization';

const OrderListView = ({ orderList }: { orderList: OrderListItem[] }) => {
  console.log('orderList');
  console.log(orderList);

  return (
    <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
      <div className="flex w-5xl flex-col gap-4">
        <OrderListTitle />
        <Divider />
        <OrderListSearch />
        <OrderList />
      </div>
    </div>
  );
};

export default OrderListView;
