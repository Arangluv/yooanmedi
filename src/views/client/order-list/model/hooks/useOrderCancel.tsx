'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partialCancelOrder } from '../../api/order-list.api';
import { useAlertDialog } from '@/shared';
import { toast } from 'sonner';
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';
import { ClientOrderListMapper } from '../../mapper';
import { ClientOrderDto } from '@/features/order/order-list';

const useOrderCancel = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();
  const { mutate } = useMutation({
    mutationFn: partialCancelOrder,
    onSuccess: (result) => {
      if (result.isSuccess) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ORDER_LIST_QUERY_KEYS.clientAllList(),
        });
      } else {
        toast.error(result.message);
      }

      setActionDiabled(false);
      onClose();
    },
  });

  const cancelOrder = (order: ClientOrderDto, orderProductId: number) => {
    setActionDiabled(true);
    const dto = ClientOrderListMapper.toPartialCancelOrderRequestDto(order, orderProductId);
    mutate(dto);
  };

  return { cancelOrder };
};

export default useOrderCancel;
