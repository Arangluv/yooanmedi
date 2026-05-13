import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { Button, useAlertDialog } from '@/shared';
import { getDialogConfig } from '../lib/generate-dialog-config';
import { type ClientOrder } from '@/features/order/order-list';
import useOrderCancel from '../model/hooks/useOrderList';

export const OrderPartialCancelTrigger = ({
  order,
  orderProduct,
}: {
  order: ClientOrder;
  orderProduct: ClientOrder['orderProducts'][number];
}) => {
  const { cancelOrder } = useOrderCancel();
  const { onOpen, setDialogConfig } = useAlertDialog();
  const dialogConfig = getDialogConfig(orderProduct.orderProductStatus, order.paymentsMethod);

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
                onClick: () => cancelOrder({ order, targetOrderProductId: orderProduct.id }),
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
