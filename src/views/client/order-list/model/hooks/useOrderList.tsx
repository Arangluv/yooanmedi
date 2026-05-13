'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientPartialOrderCancelRequestDto, partialCancelOrder } from '../../api/order-list.api';
import { useAlertDialog } from '@/shared';
import { toast } from 'sonner';
import { CLIENT_ORDER_LIST_ROOT_QUERY_KEY } from '../../lib/query-keys';

const useOrderCancel = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();
  const { mutate } = useMutation({
    mutationFn: (dto: ClientPartialOrderCancelRequestDto) => partialCancelOrder(dto),
    onSuccess: (result) => {
      if (result.isSuccess) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: [CLIENT_ORDER_LIST_ROOT_QUERY_KEY],
        });
      } else {
        toast.error(result.message);
      }

      setActionDiabled(false);
      onClose();
    },
  });

  const cancelOrder = (dto: ClientPartialOrderCancelRequestDto) => {
    setActionDiabled(true);
    mutate(dto);
  };

  return { cancelOrder };
};

export default useOrderCancel;
