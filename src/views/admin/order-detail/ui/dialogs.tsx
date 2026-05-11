'use client';

import { Button } from '@/shared';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { TRANSITION_DIALOG_CONFIG } from '../config/dialog.config';
import { useAlertDialog } from '../model/providers/AlertDialogProvider';
import useOrderDetailTransition from '../model/hooks/useOrderDetailTransition';
import { type AdminOrderDetail } from '../model/order-detail.schema';

interface TransitionTriggerProps {
  order: AdminOrderDetail;
}

export const TransitionDialogTrigger = ({ order }: TransitionTriggerProps) => {
  const { transitionOrder } = useOrderDetailTransition();
  const { setDialogConfig, onOpen } = useAlertDialog();

  return (
    <AlertDialogTrigger asChild>
      <Button
        onClick={() => {
          setDialogConfig(() => {
            const baseConfig = TRANSITION_DIALOG_CONFIG[order.orderStatus];
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
        {TRANSITION_DIALOG_CONFIG[order.orderStatus]?.triggerText}
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
