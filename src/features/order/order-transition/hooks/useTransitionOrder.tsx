import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EndPointResult, useAlertDialog } from '@/shared';
import { ORDER_QUERY_KEYS } from '@/entities/order';
import { transitionOrderApi, transitionOrderListApi } from '../api';

export const createUseTransitionOrder = () => {
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
      mutationFn: transitionOrderApi,
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
      mutationFn: transitionOrderListApi,
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
