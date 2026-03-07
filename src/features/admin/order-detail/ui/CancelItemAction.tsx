'use client';

import { Fragment } from 'react';
import { PackageX } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useOrderCollection } from '../model/order-provider';
import { checkAllOrderProductCancelled, updateOrderStatus } from '../lib/order-status-handler';

import { cancelOrderProduct } from '@/features/order/order-cancel/api/cancel-order-product';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { Button } from '@/shared/ui/shadcn/button';
import { ItemActions } from '@/shared/ui/shadcn/item';
import { OrderAction } from '../model/order-action-dialog-provider';

interface CancelItemActionProps {
  orderProductId: number;
}

const CancelItemAction = ({ orderProductId }: CancelItemActionProps) => {
  const { orderInfo } = useOrderCollection();
  const queryClient = useQueryClient();

  // TODO:: 참조 구조가 깨져있다. 리팩토링 필요
  const { mutate: cancelOrderMutation } = useMutation({
    mutationFn: ({ orderProductId }: { orderProductId: number }) =>
      cancelOrderProduct({ orderProductId, clientSideFlg: false }),
    onSuccess: async () => {
      toast.success('주문취소 처리가 완료되었습니다');
      // TODO:: 타입 단언 지우기 -> 해당 시점에는 ID가 반드시 존재
      // order status 업데이트
      const orderId = orderInfo?.progressOrder?.id as number;
      const isAllOrderProductCancelled = await checkAllOrderProductCancelled(orderId);
      if (isAllOrderProductCancelled) {
        await updateOrderStatus({
          orderId,
          orderStatus: ORDER_STATUS.CANCELLED,
          flgStatus: FLG_STATUS.COMPLETE,
          paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
        });
      } else {
        await updateOrderStatus({
          orderId,
          flgStatus: FLG_STATUS.COMPLETE,
          paymentStatus: PAYMENT_STATUS.PARTIAL_CANCEL,
        });
      }
      // 서버상태 업데이트
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: () => {
      toast.error('주문취소에 실패했습니다');
    },
  });

  return (
    <Fragment>
      <ItemActions>
        {/* <OrderAction.CancelTrigger 
        ></OrderAction.CancelTrigger> */}
      </ItemActions>
    </Fragment>
  );
};

export default CancelItemAction;
