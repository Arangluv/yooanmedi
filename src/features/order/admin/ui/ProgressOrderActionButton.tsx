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
  validate,
  changeOrderListStatusToPreparing,
  changeOrderStatusToPreparing,
} from '../lib/order-status-handler';
import { Button } from '@/shared/ui/shadcn/button';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { useQueryClient } from '@tanstack/react-query';

interface ProgressOrderActionButtonProps {
  orderStatus: OrderStatus;
  orderId: number;
}

type NextStep = {
  btnText: string;
  hasNext: boolean;
  onAction: () => Promise<void>;
};

const ProgressOrderActionButton = ({
  orderStatus,
  orderId,
  ...props
}: ProgressOrderActionButtonProps & React.ComponentProps<typeof Button>) => {
  const [nextStep, setNextStep] = useState<NextStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    switch (orderStatus) {
      case ORDER_STATUS.PENDING:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.PREPARING],
          hasNext: true,
          onAction: async () => {
            setIsLoading(true);

            const userId = await getOrderUserId(orderId);
            const orderProductIds = await getTargetOrderProductIds(orderId);

            const validateResult = await validate({
              orderProductIds,
              orderId,
              userId,
            });

            // TODO:: 에러핸들링 개선
            if (!validateResult.success) {
              throw new Error(validateResult.message);
            }

            const changeOrderProductStatusToPreparingResult =
              await changeOrderListStatusToPreparing({
                orderProductIds,
                userId,
              });

            if (!changeOrderProductStatusToPreparingResult.success) {
              throw new Error(changeOrderProductStatusToPreparingResult.message);
            }

            await changeOrderStatusToPreparing(orderId);
            await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          },
        });
        break;
      case ORDER_STATUS.PREPARING:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING],
          hasNext: true,
          onAction: async () => {},
        });
        break;
      case ORDER_STATUS.SHIPPING:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED],
          hasNext: true,
          onAction: async () => {},
        });
        break;
      case ORDER_STATUS.DELIVERED:
        setNextStep({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED],
          hasNext: false,
          onAction: async () => {},
        });
        break;
    }
  }, [orderStatus]);

  return (
    <Button
      className="text-lg font-normal"
      disabled={!nextStep?.hasNext || isLoading}
      onClick={async (e) => {
        try {
          setIsLoading(true);
          e.preventDefault();
          props.onClick?.(e);
          await nextStep?.onAction?.();

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
