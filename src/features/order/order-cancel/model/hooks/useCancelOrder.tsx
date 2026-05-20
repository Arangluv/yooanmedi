'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EndPointResult, useAlertDialog } from '@/shared';
import { AdminCancelOrderUseCase, ClientCancelOrderUseCase } from '../services';
import { toast } from 'sonner';
import { ORDER_LIST_QUERY_KEYS } from '@/features/order/order-list';

export const createUseAdminCancelOrder = (cancelOrderUseCase: AdminCancelOrderUseCase) => {
  const useAdminCancelOrder = () => {
    const queryClient = useQueryClient();
    const { setActionDiabled, onClose } = useAlertDialog();

    const onMutationSuccess = (result: EndPointResult) => {
      if (result.isSuccess) {
        toast.success(result.message);
        // queryClient.invalidateQueries({
        //   queryKey: [ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY],
        // });
        queryClient.invalidateQueries({
          queryKey: ORDER_LIST_QUERY_KEYS.adminAllList(),
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
      mutationFn: cancelOrderUseCase.partialCancel,
      onSuccess: onMutationSuccess,
    });

    const { mutate: totalCancelOrder } = useMutation({
      onMutate: () => {
        setActionDiabled(true);
      },
      mutationFn: cancelOrderUseCase.totalCancel,
      onSuccess: onMutationSuccess,
    });

    return { partialCancelOrder, totalCancelOrder };
  };

  return useAdminCancelOrder;
};

export const createUseClientCancelOrder = (cancelOrderUseCase: ClientCancelOrderUseCase) => {
  const useClientCancelOrder = () => {
    const queryClient = useQueryClient();
    const { setActionDiabled, onClose } = useAlertDialog();

    const onMutationSuccess = (result: EndPointResult) => {
      if (result.isSuccess) {
        toast.success(result.message);
        // queryClient.invalidateQueries({
        //   queryKey: [ADMIN_ORDER_DETAIL_ROOT_QUERY_KEY],
        // });
        queryClient.invalidateQueries({
          queryKey: ORDER_LIST_QUERY_KEYS.clientAllList(),
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
      mutationFn: cancelOrderUseCase.partialCancel,
      onSuccess: onMutationSuccess,
    });

    return { partialCancelOrder };
  };

  return useClientCancelOrder;
};
