'use client';

import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import useOrderListSearch from '../model/useOrderListSearch';

const OrderStatusTab = () => {
  const { filters, updateOrderStatus } = useOrderListSearch();
  return (
    <div className="bg-background flex w-full items-center justify-between rounded-lg p-4">
      <Tabs value={filters.orderStatus ?? 'all'}>
        <TabsList variant="line">
          <TabsTrigger value="all" className="text-base" onClick={() => updateOrderStatus('all')}>
            전체
          </TabsTrigger>
          {Object.values(ORDER_STATUS).map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="text-base"
              onClick={() => updateOrderStatus(status)}
            >
              {ORDER_STATUS_NAME[status]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrderStatusTab;
