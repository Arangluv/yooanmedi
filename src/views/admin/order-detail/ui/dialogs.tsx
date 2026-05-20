'use client';

import { Button, useAlertDialog } from '@/shared';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { PackageX } from 'lucide-react';
import { TRANSITION_DIALOG_CONFIG, CANCEL_DIALOG_CONFIG } from '../config/dialog.config';
import useOrderDetailTransition from '../model/hooks/useOrderDetailTransition';
import { OrderStatus } from '@/entities/order';
import { useAdminCancelOrder } from '@/features/order/order-cancel';
import { AdminOrderDetailMapper } from '../mapper';
import { OrderDetailDto } from '@/features/order/order-detail';

interface TransitionTriggerProps {
  order: OrderDetailDto;
  status: OrderStatus | null;
}

export const TransitionDialogTrigger = ({ order, status }: TransitionTriggerProps) => {
  const { transitionOrder } = useOrderDetailTransition();
  const { setDialogConfig, onOpen } = useAlertDialog();

  if (status === null) {
    return null;
  }

  return (
    <AlertDialogTrigger asChild>
      <Button
        onClick={() => {
          setDialogConfig(() => {
            const baseConfig = TRANSITION_DIALOG_CONFIG[status];
            if (!baseConfig) return null;
            return {
              ...baseConfig,
              action: {
                ...baseConfig.action,
                onClick: () => transitionOrder(order),
              },
            };
          });
          onOpen();
        }}
      >
        {TRANSITION_DIALOG_CONFIG[status]?.triggerText}
      </Button>
    </AlertDialogTrigger>
  );
};

export const PartialCancelDialogIconTrigger = (dto: AdminPartialOrderCancelRequestDto) => {
  const { partialCancelOrder } = useAdminCancelOrder();
  const { setDialogConfig, onOpen } = useAlertDialog();

  return (
    <AlertDialogTrigger asChild>
      <PackageX
        strokeWidth={1.5}
        className="text-muted-foreground size-6 cursor-pointer"
        onClick={() => {
          setDialogConfig(() => {
            const dialogConfig = CANCEL_DIALOG_CONFIG;
            return {
              ...dialogConfig,
              action: {
                ...dialogConfig.action,
                onClick: () =>
                  partialCancelOrder(
                    AdminOrderDetailMapper.toPartialCancelOrderDto(
                      dto.order,
                      dto.targetOrderProductId,
                    ),
                  ),
              },
            };
          });
          onOpen();
        }}
      >
        취소처리
      </PackageX>
    </AlertDialogTrigger>
  );
};
