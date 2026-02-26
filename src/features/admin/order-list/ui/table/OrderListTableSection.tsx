'use client';

import TableHeader from './TableHeader';
import OrderListDataTable from './OrderListDataTable';
import { columns } from '../../model/table-columns';
import useOrderList from '../../model/useOrderList';

const OrderListTableSection = () => {
  const { items, totalCount, totalPages } = useOrderList();

  return (
    <div className="bg-background flex flex-col gap-8 rounded-lg p-4">
      <TableHeader totalCount={totalCount} />
      <OrderListDataTable columns={columns} data={items} totalPages={totalPages} />
    </div>
  );
};

export default OrderListTableSection;
