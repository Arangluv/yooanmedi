'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@collections/components/shadcn';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Product, columns } from './Columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const tempData: Product[] = [
  {
    id: 1,
    name: '상품1',
    manufacturer: '제조사1',
    ingredient: '성분1',
    price: 10000,
  },
  {
    id: 2,
    name: '상품2',
    manufacturer: '제조사2',
    ingredient: '성분2',
    price: 20000,
  },
  {
    id: 3,
    name: '상품3',
    manufacturer: '제조사3',
    ingredient: '성분3',
    price: 30000,
  },
  {
    id: 4,
    name: '상품4',
    manufacturer: '제조사4',
    ingredient: '성분4',
    price: 40000,
  },
];

const ProductDataTable = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <DataTableFormField />
      <div className="flex h-full flex-col gap-4">
        <UserListViewTable columns={columns} data={tempData} />
        <DataTablePagination />
      </div>
    </div>
  );
};

function UserListViewTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="h-full w-full">
      <Table className="h-full w-full">
        <TableHeader>
          {/* <TableRow isHoverable={false}>
            <TableHead className="w-[100px]">
              <input type="checkbox" className="size-4" />
            </TableHead>
            <TableHead className="w-[100px]">제조사명</TableHead>
            <TableHead>상품명</TableHead>
            <TableHead>성분명</TableHead>
            <TableHead className="text-right">상품가격</TableHead>
          </TableRow> */}
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
          {/* <TableRow>
            <TableCell>
              <input type="checkbox" className="size-4" />
            </TableCell>
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-medium text-right">$250.00</TableCell>
          </TableRow> */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function DataTableFormField() {
  return (
    <form className="flex items-center gap-2">
      <InputGroup className="w-full max-w-[300px]">
        <InputGroupAddon>
          <SearchIcon className="size-4" />
        </InputGroupAddon>
        <InputGroupInput id="keyword" name="keyword" placeholder="키워드를 입력해주세요." />
      </InputGroup>
      <Select defaultValue={'1'}>
        <SelectTrigger className="w-fit items-center justify-start !border">
          <span className="text-foreground/60 text-sm">검색조건</span>
          <SelectValue className="!text-brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>검색 조건</SelectLabel>
            <SelectItem value="1">상품명</SelectItem>
            <SelectItem value="2">제약사명</SelectItem>
            <SelectItem value="3">성분명</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}

function DataTablePagination() {
  return (
    <div className="flex shrink-0 items-center justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default ProductDataTable;
