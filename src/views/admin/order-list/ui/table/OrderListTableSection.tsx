'use client';

import TableHeader from './TableHeader';
import OrderListDataTable from './OrderListDataTable';
import { columns } from '../../model/table-columns';
import useOrderListQuery from '../../model/hooks/useOrderListQuery';
import { AdminOrderListSearchParams } from '@/features/order/order-list';

const OrderListTableSection = ({ searchParams }: { searchParams: AdminOrderListSearchParams }) => {
  const { orders, totalCount } = useOrderListQuery(searchParams);
  return (
    <div className="bg-background flex min-h-0 flex-1 flex-col gap-8 rounded-lg p-4">
      <TableHeader totalCount={totalCount} />
      <OrderListDataTable columns={columns} data={orders} totalCount={totalCount} />
    </div>
  );
};

export default OrderListTableSection;
