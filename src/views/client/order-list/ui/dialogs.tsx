import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { Button, PaymentsMethod, useAlertDialog } from '@/shared';
import { getDialogConfig } from '../lib/generate-dialog-config';
import { type ClientOrder } from '@/features/order/order-list';
import useOrderCancel from '../model/hooks/useOrderList';

export const OrderPartialCancelTrigger = ({
  orderProduct,
  paymentsMethod,
}: {
  orderProduct: ClientOrder['orderProducts'][number];
  paymentsMethod: PaymentsMethod;
}) => {
  const { cancelOrder } = useOrderCancel();
  const { onOpen, setDialogConfig } = useAlertDialog();
  const dialogConfig = getDialogConfig(orderProduct.orderProductStatus, paymentsMethod);

  return (
    <AlertDialogTrigger asChild>
      <Button
        variant={'destructive'}
        onClick={() => {
          setDialogConfig(() => {
            if (!dialogConfig) return null;
            return {
              ...dialogConfig,
              action: {
                ...dialogConfig.action,
                onClick: () => cancelOrder(),
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
