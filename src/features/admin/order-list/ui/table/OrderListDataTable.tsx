'use client';

import { useEffect, useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '@/shared/ui/shadcn/table';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/shared/ui/shadcn/empty';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { ArchiveX } from 'lucide-react';
import useOrderListSearch from '../../model/useOrderListSearch';
import TablePagination from './TablePagination';
import FloatActionBox from '../FloatActionBox';
import { ScrollArea } from '@/shared/ui/shadcn/scroll-area';

interface OrderListDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages: number;
}

const OrderListDataTable = <TData, TValue>({
  columns,
  data,
  totalPages,
}: OrderListDataTableProps<TData, TValue>) => {
  const { filters } = useOrderListSearch();
  const [rowSelection, setRowSelection] = useState({});
  const [checkboxVisibility, setCheckboxVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => {
      return row.id;
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setCheckboxVisibility,
    state: {
      rowSelection,
      columnVisibility: checkboxVisibility,
    },
  });

  useEffect(() => {
    // 전체 상태 탭에서는 checkbox를 숨김 처리
    const checkboxColumns = table.getColumn('select');
    checkboxColumns?.toggleVisibility(
      filters.orderStatus !== 'all' && filters.orderStatus !== ORDER_STATUS.CANCELLED,
    );

    // 탭이 변경되면 selected row 초기화
    table.resetRowSelection();
  }, [filters.orderStatus]);

  return (
    <div className="overflow-hidden">
      <ScrollArea className="h-[500px]">
        <Table className="text-base">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    // 전체 상태 탭에서는 select action 동작을 수행하지 않음
                    if (
                      filters.orderStatus !== 'all' &&
                      filters.orderStatus !== ORDER_STATUS.CANCELLED
                    ) {
                      row.toggleSelected();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <TableEmpty />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <TablePagination totalPages={totalPages} />
      <FloatActionBox selectedRows={rowSelection} />
    </div>
  );
};

const TableEmpty = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveX strokeWidth={1.5} className="text-foreground/60 size-5" />
        </EmptyMedia>
        <EmptyTitle>주문내역이 없습니다.</EmptyTitle>
        <EmptyDescription>해당 기간 혹은 검색조건에 맞는 주문내역이 없습니다.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default OrderListDataTable;
