import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { Button, PaymentsMethod, useAlertDialog } from '@/shared';
import { getDialogConfig } from '../lib/generate-dialog-config';
import { type ClientOrder } from '@/features/order/order-list';

export const OrderPartialCancelTrigger = ({
  orderProduct,
  paymentsMethod,
}: {
  orderProduct: ClientOrder['orderProducts'][number];
  paymentsMethod: PaymentsMethod;
}) => {
  const { onOpen, setDialogConfig } = useAlertDialog();
  const dialogConfig = getDialogConfig(orderProduct.orderProductStatus, paymentsMethod);

  return (
    <AlertDialogTrigger asChild>
      <Button
        variant={'destructive'}
        onClick={() => {
          setDialogConfig(dialogConfig);
          onOpen();
        }}
      >
        {dialogConfig.triggerText}
      </Button>
    </AlertDialogTrigger>
  );
};
