import { Button, useAlertDialog } from '@/shared';
import { PackageX } from 'lucide-react';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { OrderStatus } from '@/entities/order';
import { useAdminCancelOrder } from '@/features/order/order-cancel';
import { OrderDetailDto } from '@/features/order/order-detailv2';
import { useTransitionOrder } from '@/features/order/order-transition';
import { AdminOrderDetailMapper } from '../mapper';
import { TRANSITION_DIALOG_CONFIG, CANCEL_DIALOG_CONFIG } from '../config/dialog.config';

interface TransitionTriggerProps {
  order: OrderDetailDto;
  status: OrderStatus | null;
}

export const TransitionDialogTrigger = ({ order, status }: TransitionTriggerProps) => {
  const { transitionOrderMutate } = useTransitionOrder();
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
                onClick: () =>
                  transitionOrderMutate(AdminOrderDetailMapper.toTransitionOrderDto(order)),
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

export const PartialCancelDialogIconTrigger = ({
  order,
  orderProductId,
}: {
  order: OrderDetailDto;
  orderProductId: number;
}) => {
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
                    AdminOrderDetailMapper.toPartialCancelOrderDto(order, orderProductId),
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
