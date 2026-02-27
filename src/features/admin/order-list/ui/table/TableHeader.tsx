'use client';

import { Sheet, SlidersHorizontal } from 'lucide-react';

import { ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn/collapsible';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/ui/shadcn/tooltip';

import useOrderListSearch from '../../model/useOrderListSearch';
import { ExportExcel } from '../../lib/excel-export';

const TableHeader = ({ totalCount }: { totalCount: number }) => {
  return (
    <Collapsible className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <TabTitle totalCount={totalCount} />
        <TableAction />
      </div>
      {/* <CollapsibleFilterContent /> */}
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

const TableAction = () => {
  return (
    <div className="flex items-center gap-3">
      {/* <FilterButton /> */}
      <ExcelExportButton />
    </div>
  );
};

// 추후 확장 및 요청 시 추가
// const FilterButton = () => {
//   return (
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <CollapsibleTrigger asChild>
//           <Button variant="ghost" size="icon-lg">
//             <SlidersHorizontal className="text-muted-foreground !h-5 !w-5" />
//           </Button>
//         </CollapsibleTrigger>
//       </TooltipTrigger>
//       <TooltipContent className="text-base">필터</TooltipContent>
//     </Tooltip>
//   );
// };

const CollapsibleFilterContent = () => {
  return <CollapsibleContent>접혀</CollapsibleContent>;
};

const ExcelExportButton = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-lg" onClick={async () => await ExportExcel()}>
          <Sheet className="text-muted-foreground !h-5 !w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-base">엑셀 내보내기</TooltipContent>
    </Tooltip>
  );
};

export default TableHeader;
