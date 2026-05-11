'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderTransitionApi } from '@/features/order/order-transition';
import { AdminOrderListItem, toOrder } from '../admin-order-list.schema';
import { useAlertDialog } from '@/views/admin/order-detail/model/providers/AlertDialogProvider';
import { ADMIN_ORDER_LIST_ROOT_QUERY_KEY } from '../../lib/query-keys';
import { ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY } from '@/views/admin/order-detail/lib/query-keys';

const useOrderListTransition = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();
  const { mutate } = useMutation({
    mutationFn: OrderTransitionApi.transitionOrderList,
    onSuccess: (result) => {
      if (result.isSuccess) {
        const { totalCount } = result.data;
        toast.success(`${totalCount}개의 주문을 업데이트 했습니다.`);
        queryClient.invalidateQueries({
          queryKey: [ADMIN_ORDER_LIST_ROOT_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY],
        });
      } else {
        toast.success('주문을 업데이트하는데 문제가 발생했습니다');
      }

      setActionDiabled(false);
      onClose();
    },
  });

  const transitionOrder = (orderList: AdminOrderListItem[]) => {
    const order = toOrder(orderList);
    setActionDiabled(true);
    mutate(order);
  };

  return { transitionOrder };
};

export default useOrderListTransition;
