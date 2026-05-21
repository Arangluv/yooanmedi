'use client';

import { type Row } from '@tanstack/react-table';
import { Button, useAlertDialog } from '@/shared';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { ORDER_STATUS, OrderStatus } from '@/entities/order';
import useOrderListSearch from '../model/useOrderListSearch';
import { getCancelDialogConfig, getTransitionDialogConfig } from '../lib/get-dialog-config';
import { useAdminCancelOrder } from '@/features/order/order-cancel';
import { AdminOrderListMapper } from '../mapper';
import { AdminOrderListItemDto } from '@/features/order/order-list';
import { useTransitionOrder } from '@/features/order/order-transition';

interface TransitionTriggerProps {
  selectedRows: Row<AdminOrderListItemDto>[];
}

export const TransitionDialogTrigger = ({ selectedRows }: TransitionTriggerProps) => {
  const { setDialogConfig, onOpen } = useAlertDialog();
  const { filters } = useOrderListSearch();
  const { transitionOrderListMutate } = useTransitionOrder();

  if (
    filters.orderStatus === ORDER_STATUS.delivered ||
    filters.orderStatus === ORDER_STATUS.cancel_request
  ) {
    return null;
  }

  const currentOrderStatus = filters.orderStatus as OrderStatus;
  const selectedOrderCount = Object.keys(selectedRows).length;
  const dialogConfig = getTransitionDialogConfig(currentOrderStatus, selectedOrderCount);

  return (
    <AlertDialogTrigger asChild>
      <Button
        onClick={() => {
          const orders = selectedRows.map((row) => row.original);
          setDialogConfig(() => {
            if (!dialogConfig) return null;
            return {
              ...dialogConfig,
              action: {
                ...dialogConfig.action,
                onClick: () =>
                  transitionOrderListMutate(AdminOrderListMapper.toTransitionOrderListDto(orders)),
              },
            };
          });
          onOpen();
        }}
      >
        {dialogConfig.triggerText}
      </Button>
    </AlertDialogTrigger>
  );
};

export const CancelDialogTrigger = ({ selectedRows }: TransitionTriggerProps) => {
  const { setDialogConfig, onOpen } = useAlertDialog();
  const { filters } = useOrderListSearch();
  const { totalCancelOrder } = useAdminCancelOrder();

  if (filters.orderStatus === ORDER_STATUS.cancel_request) {
    return null;
  }

  const selectedOrderCount = Object.keys(selectedRows).length;
  const dialogConfig = getCancelDialogConfig(selectedOrderCount);

  return (
    <AlertDialogTrigger asChild>
      <Button
        variant={'destructive'}
        onClick={() => {
          const orders = selectedRows.map((row) => row.original);
          setDialogConfig(() => {
            if (!dialogConfig) return null;
            return {
              ...dialogConfig,
              action: {
                ...dialogConfig.action,
                onClick: () =>
                  totalCancelOrder(AdminOrderListMapper.toTotalCancelRequestDto(orders)),
              },
            };
          });
          onOpen();
        }}
      >
        {dialogConfig.triggerText}
      </Button>
    </AlertDialogTrigger>
  );
};
