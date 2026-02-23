'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  ORDER_STATUS,
  ORDER_STATUS_NAME,
  type OrderStatus,
} from '@/entities/order/constants/order-status';
import {
  getOrderUserId,
  getTargetOrderProductIds,
  validateContext,
  changeOrderListStatusToPreparing,
  updateOrderStatus,
  updateOrderListStatus,
} from '../lib/order-status-handler';
import { Button } from '@/shared/ui/shadcn/button';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { useQueryClient } from '@tanstack/react-query';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { validateBeforeAction } from '../lib/validate';

interface ProgressOrderActionButtonProps {
  orderStatus: OrderStatus;
  orderId: number;
}

type NextStep = {
  btnText?: string;
  hasNext: boolean;
  onAction?: () => Promise<void>;
};

const ProgressOrderActionButton = ({
  orderStatus,
  orderId,
  ...props
}: ProgressOrderActionButtonProps & React.ComponentProps<typeof Button>) => {
  const [nextStep, setNextStep] = useState<NextStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const getChangeOrderStatusContext = async (orderStatus: OrderStatus) => {
    const userId = await getOrderUserId(orderId);
    const orderProductIds = await getTargetOrderProductIds(orderId, orderStatus);

    const validateResult = await validateContext({
      orderProductIds,
      orderId,
      userId,
    });

    if (!validateResult.success) {
      throw new Error(validateResult.message);
    }

    return {
      userId,
      orderProductIds,
    };
  };

  useEffect(() => {
    switch (orderStatus) {
      case ORDER_STATUS.PENDING:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.PREPARING],
          hasNext: true,
          onAction: async () => {
            setIsLoading(true);
            const { userId, orderProductIds } = await getChangeOrderStatusContext(orderStatus);

            const validateBeforeActionResult = await validateBeforeAction({
              orderId,
              currentOrderStatus: orderStatus,
            });

            if (!validateBeforeActionResult.success) {
              throw new Error(validateBeforeActionResult.message);
            }

            const changeOrderProductStatusToPreparingResult =
              await changeOrderListStatusToPreparing({
                orderProductIds,
                userId,
              });

            if (!changeOrderProductStatusToPreparingResult.success) {
              throw new Error(changeOrderProductStatusToPreparingResult.message);
            }

            await updateOrderStatus({
              orderId,
              orderStatus: ORDER_STATUS.PREPARING,
              paymentStatus: PAYMENT_STATUS.COMPLETE,
            });
            await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          },
        });
        break;
      case ORDER_STATUS.PREPARING:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING],
          hasNext: true,
          onAction: async () => {
            const { orderProductIds } = await getChangeOrderStatusContext(orderStatus);

            const validateBeforeActionResult = await validateBeforeAction({
              orderId,
              currentOrderStatus: orderStatus,
            });

            if (!validateBeforeActionResult.success) {
              throw new Error(validateBeforeActionResult.message);
            }

            const updateOrderListStatusResult = await updateOrderListStatus({
              orderProductIds,
              orderStatus: ORDER_STATUS.SHIPPING,
            });

            if (!updateOrderListStatusResult.success) {
              throw new Error(updateOrderListStatusResult.message);
            }

            await updateOrderStatus({
              orderId,
              orderStatus: ORDER_STATUS.SHIPPING,
              paymentStatus: PAYMENT_STATUS.COMPLETE,
            });
            await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          },
        });
        break;
      case ORDER_STATUS.SHIPPING:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED],
          hasNext: true,
          onAction: async () => {
            const { orderProductIds } = await getChangeOrderStatusContext(orderStatus);

            const validateBeforeActionResult = await validateBeforeAction({
              orderId,
              currentOrderStatus: orderStatus,
            });

            if (!validateBeforeActionResult.success) {
              throw new Error(validateBeforeActionResult.message);
            }

            const updateOrderListStatusResult = await updateOrderListStatus({
              orderProductIds,
              orderStatus: ORDER_STATUS.DELIVERED,
            });

            if (!updateOrderListStatusResult.success) {
              throw new Error(updateOrderListStatusResult.message);
            }

            await updateOrderStatus({
              orderId,
              orderStatus: ORDER_STATUS.DELIVERED,
              paymentStatus: PAYMENT_STATUS.COMPLETE, // todo:: Paymentstatus를 넘겨줄 필요가 있을까? 해당 시점에서는 반드시 complete다
            });
            await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          },
        });
        break;
      case ORDER_STATUS.DELIVERED:
        setNextStep({
          hasNext: false,
        });
        break;
    }
  }, [orderStatus]);

  if (!nextStep?.hasNext) {
    return null;
  }

  return (
    <Button
      className="text-lg font-normal"
      disabled={!nextStep?.hasNext || isLoading}
      onClick={async (e) => {
        try {
          setIsLoading(true);
          props.onClick?.(e);
          // await nextStep?.onAction?.();

          toast.success(`${nextStep?.btnText} 처리되었습니다`);
        } catch (error) {
          let errorMessage =
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading && <Spinner className="size-4" />}
      {nextStep?.btnText} 처리
    </Button>
  );
};

export default ProgressOrderActionButton;
