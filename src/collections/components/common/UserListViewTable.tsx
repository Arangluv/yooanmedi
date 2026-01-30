'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

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
  Button,
} from '@collections/components/shadcn';
import { SetStateAction, Dispatch, useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { columns, Product } from './Columns';
import { useQuery } from '@tanstack/react-query';
import { getProductList } from '@/collections/apis/product/actions';
import { Fragment } from 'react';
import type { Table as TableType } from '@tanstack/react-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages: number;
  totalRows: number;
  page: { pageIndex: number; pageSize: number };
  setPage: Dispatch<SetStateAction<{ pageIndex: number; pageSize: number }>>;
}

const ProductDataTable = () => {
  const LIMIT = 15;

  const [page, setPage] = useState({ pageIndex: 0, pageSize: LIMIT });
  const [condition, setCondition] = useState('pn');
  const [keyword, setKeyword] = useState('');

  const { data } = useQuery({
    queryKey: ['product-list', page, keyword, condition],
    queryFn: () => getProductList({ page: page.pageIndex + 1, limit: LIMIT, keyword, condition }),
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <DataTableHeader totalRows={data?.totalDocs || 0} />
      <DataTableSearchField
        setCondition={setCondition}
        setKeyword={setKeyword}
        setPage={setPage}
        limit={LIMIT}
      />
      <div className="flex h-full flex-col gap-4">
        <ProductListDataTable
          columns={columns}
          data={(data?.docs as Product[]) || []}
          totalPages={data?.totalPages || 0}
          totalRows={data?.totalDocs || 0}
          page={page}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

function DataTableHeader({ totalRows }: { totalRows: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold">
        등록된 상품 <span className="text-foreground/60 text-sm">(총 {totalRows}개의 상품)</span>
      </span>
    </div>
  );
}

function ProductListDataTable<TData, TValue>({
  columns,
  data,
  totalRows,
  totalPages,
  page,
  setPage,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    console.log('rowSelection');
    console.log(rowSelection);
  }, [rowSelection]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    // 페이지 세팅 부분
    manualPagination: true,
    getRowId: (row: TData) => {
      // TODO 이 부분 해결하기
      // @ts-ignore
      return row.id;
    },
    // autoResetPageIndex: true, // 데이터 업데이트 시 페이지 인덱스 초기화
    rowCount: totalRows,
    pageCount: totalPages,
    onPaginationChange: setPage,
    // 상태
    state: {
      rowSelection,
      pagination: page,
    },
  });

  return (
    <Fragment>
      <div className="h-full w-full overflow-y-auto">
        <Table className="h-full w-full">
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
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => row.toggleSelected()}
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
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  상품 리스트가 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </Fragment>
  );
}

function DataTableSearchField({
  setCondition,
  setKeyword,
  setPage,
  limit,
}: {
  setCondition: (condition: string) => void;
  setKeyword: (keyword: string) => void;
  setPage: (page: { pageIndex: number; pageSize: number }) => void;
  limit: number;
}) {
  const handleKeywordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    const keyword = formData.keyword as string;
    const condition = formData.condition as 'pn' | 'cn' | 'in';

    setKeyword(keyword);
    setCondition(condition);
    // 페이지 초기화
    setPage({ pageIndex: 0, pageSize: limit });
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleKeywordSubmit}>
      <InputGroup className="w-full max-w-[300px]">
        <InputGroupAddon>
          <SearchIcon className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          id="keyword"
          name="keyword"
          placeholder="키워드를 입력해주세요."
          // value={keyword}
          // onChange={(e) => setKeyword(e.target.value)}
        />
      </InputGroup>
      {/* <Select defaultValue={'pn'} value={condition} onValueChange={(value) => setCondition(value)}> */}
      <Select defaultValue={'pn'} name="condition">
        <SelectTrigger className="w-fit items-center justify-start !border">
          <span className="text-foreground/60 text-sm">검색조건</span>
          <SelectValue className="!text-brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>검색 조건</SelectLabel>
            <SelectItem value="pn">상품명</SelectItem>
            <SelectItem value="cn">제조사명</SelectItem>
            <SelectItem value="in">성분명</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}

function DataTablePagination({ table }: { table: TableType<any> }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-4">
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <ChevronLeftIcon className="size-4" />
        이전
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        다음
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}

export default ProductDataTable;
