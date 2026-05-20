'use client';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlertDialog } from '@/shared';
import { OrderTransitionApi } from '@/features/order/order-transition';
import { AdminOrderListItem, toOrders } from '../admin-order-list.schema';
import { ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY } from '@/views/admin/order-detail/lib/query-keys'; // todo :: 잘못된 참조방식
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';

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
          queryKey: [ORDER_LIST_QUERY_KEYS.adminAllList],
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
    const order = toOrders(orderList);
    setActionDiabled(true);
    mutate(order);
  };

  return { transitionOrder };
};

export default useOrderListTransition;
