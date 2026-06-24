'use client';

import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { Button, useAlertDialog } from '@/shared';
import { getDialogConfig } from '../lib/generate-dialog-config';
import { ClientOrderListItem } from '@/features/order/order-list';
import { useClientCancelOrder } from '@/features/order/order-cancel';
import { ClientOrderListMapper } from '../mapper';

export const OrderPartialCancelTrigger = ({
  order,
  orderProduct,
}: {
  order: ClientOrderListItem;
  orderProduct: ClientOrderListItem['orderProducts'][number];
}) => {
  const { partialCancelOrder } = useClientCancelOrder();
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
                onClick: () =>
                  partialCancelOrder(
                    ClientOrderListMapper.toPartialCancelOrderRequestDto(order, orderProduct.id),
                  ),
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
