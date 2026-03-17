'use client';

import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

import { PAYMENT_STATUS_NAME } from '@/entities/order/constants/payment-status';
import { PAYMENTS_METHOD_NAME } from '@/entities/order/constants/payments-options';
import { formatNumberWithCommas } from '@/shared/lib/fomatters';
import OrderStatusBadge from '@/entities/order/ui/admin/badge';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';

import FlgStatusBadge from '../ui/badge/FlgStatusBadge';
import { OrderListItem } from './order-list-schema';
import Link from 'next/link';

export const columns: ColumnDef<OrderListItem>[] = [
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
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'orderNo',
    header: '주문번호',
    cell: ({ row }) => {
      return (
        <Link
          className="hover:text-primary !hover:underline"
          href={`/admin/collections/order/${row.original.id}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {row.original.orderNo}
        </Link>
      );
    },
  },
  {
    accessorKey: 'orderUser',
    header: '상호명',
  },
  {
    accessorKey: 'orderStatus',
    header: '주문상태',
    cell: ({ row }) => {
      return <OrderStatusBadge orderStatus={row.original.orderStatus} />;
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: '결제상태',
    cell: ({ row }) => {
      return <div>{PAYMENT_STATUS_NAME[row.original.paymentStatus]}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: '주문일시',
    cell: ({ row }) => {
      return <div>{moment(row.original.createdAt).format('YYYY-MM-DD')}</div>;
    },
  },
  {
    accessorKey: 'flgStatus',
    header: '처리상태',
    cell: ({ row }) => {
      return <FlgStatusBadge flgStatus={row.original.flgStatus} />;
    },
  },
  {
    accessorKey: 'finalPrice',
    header: () => <div className="text-right">최종 주문 금액</div>,
    cell: ({ row }) => {
      return <div className="text-right">{formatNumberWithCommas(row.original.finalPrice)}원</div>;
    },
  },
  {
    accessorKey: 'paymentsMethod',
    header: () => <div className="text-center">결제 방법</div>,
    cell: ({ row }) => {
      return <div className="text-center">{PAYMENTS_METHOD_NAME[row.original.paymentsMethod]}</div>;
    },
  },
];
