'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@collections/components/shadcn';

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
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행선택"
      />
    ),
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
    header: () => <div className="text-right">가격</div>,
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
