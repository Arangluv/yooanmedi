'use client';

import { Sheet } from 'lucide-react';
import { ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';
import { Button } from '@/shared/ui/shadcn/button';
import { Collapsible, CollapsibleContent } from '@/shared/ui/shadcn/collapsible';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/shadcn/tooltip';
import useOrderListSearch from '../../model/useOrderListSearch';
import { ExportExcel } from '../../lib/excel-export';
import { AdminOrderListResult } from '../../model/admin-order-list.schema';

const TableHeader = ({
  totalCount,
  orders,
}: {
  totalCount: number;
  orders: AdminOrderListResult['orders'];
}) => {
  return (
    <Collapsible className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <TabTitle totalCount={totalCount} />
        <TableAction orders={orders} />
      </div>
    </Collapsible>
  );
};

const TabTitle = ({ totalCount }: { totalCount: number }) => {
  const { filters } = useOrderListSearch();

  return (
    <div className="flex items-center gap-3">
      {/* Table Header */}
      <span className="text-2xl font-bold">
        {filters.orderStatus === 'all' ? '전체' : ORDER_STATUS_NAME[filters.orderStatus]}
      </span>
      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full p-1 text-sm">
        {totalCount}
      </span>
    </div>
  );
};

const TableAction = ({ orders }: { orders: AdminOrderListResult['orders'] }) => {
  return (
    <div className="flex items-center gap-3">
      {/* <FilterButton /> */}
      <ExcelExportButton orders={orders} />
    </div>
  );
};

const ExcelExportButton = ({ orders }: { orders: AdminOrderListResult['orders'] }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-lg" onClick={async () => await ExportExcel(orders)}>
          <Sheet className="text-muted-foreground !h-5 !w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-base">엑셀 내보내기</TooltipContent>
    </Tooltip>
  );
};

export default TableHeader;
