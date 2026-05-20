'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAlertDialog } from '@/shared';
import { totalCancelOrder as totalCancelOrderApi } from '../../api/order-list.api';
import { ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY } from '@/views/admin/order-detail/lib/query-keys';
import { AdminOrderListItem } from '../admin-order-list.schema';
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';
import { AdminOrderListMapper } from '../../mapper';

const useOrderCancel = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();

  const { mutate: totalCancelMutate } = useMutation({
    mutationFn: totalCancelOrderApi,
    onSuccess: (result) => {
      if (result.isSuccess) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: [ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: ORDER_LIST_QUERY_KEYS.adminAllList(),
        });
      } else {
        toast.error(result.message);
      }

      setActionDiabled(false);
      onClose();
    },
  });

  const totalCancelOrder = (orders: AdminOrderListItem[]) => {
    setActionDiabled(true);
    const dto = AdminOrderListMapper.toTotalCancelRequestDto(orders);
    totalCancelMutate(dto);
  };

  return { totalCancelOrder };
};

export default useOrderCancel;
