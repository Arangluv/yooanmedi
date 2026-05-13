'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAlertDialog } from '@/shared';
import {
  AdminPartialOrderCancelRequestDto,
  partialCancelOrder as partialCancelOrderApi,
} from '../../api/order-detail.api';
import { ADMIN_ORDER_LIST_ROOT_QUERY_KEY } from '@/views/admin/order-list/lib/query-keys';
import { ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY } from '../../lib/query-keys';
import { AdminOrderDetail } from '../order-detail.schema';

const useOrderCancel = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();

  const { mutate: partialCancelMutate } = useMutation({
    mutationFn: partialCancelOrderApi,
    onSuccess: (result) => {
      if (result.isSuccess) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: [ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [ADMIN_ORDER_LIST_ROOT_QUERY_KEY],
        });
      } else {
        toast.error(result.message);
      }

      setActionDiabled(false);
      onClose();
    },
  });

  const partialCancelOrder = (dto: AdminPartialOrderCancelRequestDto) => {
    setActionDiabled(true);
    partialCancelMutate(dto);
  };

  return { partialCancelOrder };
};

export default useOrderCancel;
