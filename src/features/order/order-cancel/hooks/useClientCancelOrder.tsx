'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EndPointResult, useAlertDialog } from '@/shared';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { clientPartialCancelOrderApi } from '../api';

export const useClientCancelOrder = () => {
  const queryClient = useQueryClient();
  const { setActionDiabled, onClose } = useAlertDialog();

  const onMutationSuccess = (result: EndPointResult) => {
    if (result.isSuccess) {
      toast.success(result.message);
      queryClient.invalidateQueries({
        queryKey: ORDER_QUERY_KEYS.all(),
      });
    } else {
      toast.error(result.message);
    }

    setActionDiabled(false);
    onClose();
  };

  const { mutate: partialCancelOrder } = useMutation({
    onMutate: () => {
      setActionDiabled(true);
    },
    mutationFn: clientPartialCancelOrderApi,
    onSuccess: onMutationSuccess,
  });

  return { partialCancelOrder };
};
