'use client';

import { type Row } from '@tanstack/react-table';
import { Button } from '@/shared';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { ORDER_STATUS, OrderStatus } from '@/entities/order';
import useOrderListSearch from '../model/useOrderListSearch';
import { getTransitionDialogConfig } from '../lib/get-dialog-config';
import { useAlertDialog } from '@/views/admin/order-detail/model/providers/AlertDialogProvider'; // todo :: AlertDialog 공통화 진행 시 참조방식 수정
import useOrderListTransition from '../model/hooks/useOrderListTransition';
import { AdminOrderListItem } from '../model/admin-order-list.schema';

interface TransitionTriggerProps {
  selectedRows: Row<AdminOrderListItem>[];
}

export const TransitionDialogTrigger = ({ selectedRows }: TransitionTriggerProps) => {
  const { setDialogConfig, onOpen } = useAlertDialog();
  const { filters } = useOrderListSearch();
  const { transitionOrder } = useOrderListTransition();

  // 배송완료된 상품에서 보여주지 않음
  if (filters.orderStatus === ORDER_STATUS.delivered) {
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
                onClick: () => transitionOrder(orders),
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

/** TODO :: 취소구현파트 리팩토링 시 작성해주세요 */
export const CancelDialogTrigger = () => {
  return (
    <AlertDialogTrigger asChild>
      <Button variant="destructive">취소처리</Button>
    </AlertDialogTrigger>
  );
};
