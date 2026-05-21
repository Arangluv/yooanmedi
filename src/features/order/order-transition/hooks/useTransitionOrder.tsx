'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { OrderTransitionUseCase } from '../usecase';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { EndPointResult, useAlertDialog } from '@/shared';

export const createUseTransitionOrder = (useCase: OrderTransitionUseCase) => {
  const useTransitionOrder = () => {
    const queryClient = useQueryClient();
    const { setActionDiabled, onClose } = useAlertDialog();

    const onSuccessMutate = (result: EndPointResult) => {
      if (result.isSuccess) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ORDER_QUERY_KEYS.all(),
        });
        return;
      }

      toast.error(result.message);
    };

    const { mutate: transitionOrderMutate } = useMutation({
      mutationFn: useCase.transitionOrder,
      onMutate: () => {
        setActionDiabled(true);
      },
      onSuccess: onSuccessMutate,
      onSettled: () => {
        setActionDiabled(false);
        onClose();
      },
    });

    const { mutate: transitionOrderListMutate } = useMutation({
      mutationFn: useCase.transitionOrderList,
      onMutate: () => {
        setActionDiabled(true);
      },
      onSuccess: onSuccessMutate,
      onSettled: () => {
        setActionDiabled(false);
        onClose();
      },
    });

    return { transitionOrderMutate, transitionOrderListMutate };
  };

  return useTransitionOrder;
};
