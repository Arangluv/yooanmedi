'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderTransitionApi } from '@/features/order/order-transition';
import { AdminOrderDetail, toOrder } from '../order-detail.schema';
import { toast } from 'sonner';
import { useAlertDialog } from '@/shared';
import { adminOrderDetailQueryKey } from '../../lib/query-keys';
import { ADMIN_ORDER_LIST_ROOT_QUERY_KEY } from '@/views/admin/order-list/lib/query-keys';

const useOrderDetailTransition = () => {
  const queryClient = useQueryClient();

  const { setActionDiabled, onClose } = useAlertDialog();
  const { mutate } = useMutation({
    mutationFn: OrderTransitionApi.transitionOrder,
    onSuccess: (result) => {
      if (result.isSuccess) {
        toast.success('주문을 업데이트했습니다');
        queryClient.invalidateQueries({
          queryKey: adminOrderDetailQueryKey(result.data.orderId),
        });
        queryClient.invalidateQueries({
          queryKey: [ADMIN_ORDER_LIST_ROOT_QUERY_KEY],
        });
      } else {
        toast.success('주문을 업데이트하는데 문제가 발생했습니다');
      }

      setActionDiabled(false);
      onClose();
    },
  });

  const transitionOrder = (orderDetail: AdminOrderDetail) => {
    setActionDiabled(true);
    const order = toOrder(orderDetail);
    mutate(order);
  };

  return { transitionOrder };
};

export default useOrderDetailTransition;
