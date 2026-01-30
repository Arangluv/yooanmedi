'use client';

import { ColumnDef, RowData } from '@tanstack/react-table';
import { Checkbox } from '@collections/components/shadcn';
import '@tanstack/table-core';

export interface Product {
  id: number;
  name: string;
  manufacturer: string;
  ingredient: string;
  price: number;
}

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const addAllRowsProducts = table.options.meta?.addAllRowsProducts;
      const removeAllRowsProducts = table.options.meta?.removeAllRowsProducts;

      if (!addAllRowsProducts || !removeAllRowsProducts) {
        return null;
      }

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            // 전체 상품 추가 / 삭제하기
            const targetData = table.getRowModel().rows.map((row) => row.original);

            if (value) {
              addAllRowsProducts(targetData);
            } else {
              removeAllRowsProducts(targetData);
            }

            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="전체선택"
        />
      );
    },
    cell: ({ table, row }) => {
      const onRowSelectionChange = table.options.meta?.onRowSelectionChange;

      if (!onRowSelectionChange) {
        return null;
      }

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onCheckedChange={(value) => {
            onRowSelectionChange({ row, selected: !!value });
          }}
          aria-label="행선택"
        />
      );
    },
  },
  {
    accessorKey: 'id',
    header: '번호',
  },
  {
    accessorKey: 'name',
    header: '상품명',
  },
  {
    accessorKey: 'manufacturer',
    header: '제조사명',
  },
  {
    accessorKey: 'ingredient',
    header: '성분명',
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">기본가격</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(price);

      return <div className="text-right">{formattedPrice}</div>;
    },
  },
];
