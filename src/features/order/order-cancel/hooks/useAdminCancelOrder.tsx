'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAlertDialog } from '@/shared';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import {
  adminPartialCancelOrderApi,
  adminTotalCancelOrderApi,
  CancelOrderApiResponse,
} from '../api';

export const useAdminCancelOrder = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();

  const onMutationSuccess = (response: CancelOrderApiResponse) => {
    if (response.isSuccess) {
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.all(),
      });
    } else {
      toast.error(response.message);
    }

    setActionDiabled(false);
    onClose();
  };

  const { mutate: partialCancelOrder } = useMutation({
    onMutate: () => {
      setActionDiabled(true);
    },
    mutationFn: adminPartialCancelOrderApi,
    onSuccess: onMutationSuccess,
  });

  const { mutate: totalCancelOrder } = useMutation({
    onMutate: () => {
      setActionDiabled(true);
    },
    mutationFn: adminTotalCancelOrderApi,
    onSuccess: onMutationSuccess,
  });

  return { partialCancelOrder, totalCancelOrder };
};
