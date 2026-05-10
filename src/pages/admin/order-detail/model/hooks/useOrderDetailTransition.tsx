'use client';

import { useMutation } from '@tanstack/react-query';
import { OrderTransitionApi } from '@/features/order/order-transition';
import { AdminOrderDetail, toOrder } from '../order-detail.schema';
import { toast } from 'sonner';

const useOrderDetailTransition = () => {
  const { mutate } = useMutation({
    mutationFn: OrderTransitionApi.transitionOrder,
    onSuccess: (result) => {
      if (result.isSuccess) {
        toast.success('주문을 업데이트했습니다');
      } else {
        toast.success('주문을 업데이트하는데 문제가 발생했습니다');
      }
    },
  });

  const transitionOrder = (orderDetail: AdminOrderDetail) => {
    const order = toOrder(orderDetail);
    // todo :: order-list, order update 분리
    mutate([order]);
  };

  return { transitionOrder };
};

export default useOrderDetailTransition;
