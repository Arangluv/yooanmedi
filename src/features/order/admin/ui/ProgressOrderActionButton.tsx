'use client';

import { useEffect, useState } from 'react';

import {
  ORDER_STATUS,
  ORDER_STATUS_NAME,
  type OrderStatus,
} from '@/entities/order/constants/order-status';

import { Button } from '@/shared/ui/shadcn/button';
import { useOrderAlertDialog } from '../model/dialog-provider';
import { useOrderCollection } from '../model/order-provider';

interface ProgressOrderActionButtonProps {
  orderStatus: OrderStatus;
  orderId: number;
}

type NextStep = {
  btnText?: string;
  hasNext: boolean;
  onClick?: () => void;
};

const ProgressOrderActionButton = ({
  orderStatus,
  orderId,
  ...props
}: ProgressOrderActionButtonProps & React.ComponentProps<typeof Button>) => {
  const { orderInfo } = useOrderCollection();
  const { setContent, setTargetOrder } = useOrderAlertDialog();

  const [btnStatus, setBtnStatus] = useState<NextStep | null>(null);

  useEffect(() => {
    const targetOrderProductCount = orderInfo?.progressOrder.orderProducts.length;

    switch (orderStatus) {
      case ORDER_STATUS.PENDING:
        setBtnStatus({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.PREPARING],
          hasNext: true,
          onClick: () => {
            setContent({
              title: `${targetOrderProductCount}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리하시겠습니까?`,
              description: '선택한 주문의 상태가 일괄 변경됩니다',
              confirmText: '상품준비중 처리',
            });

            setTargetOrder({
              status: ORDER_STATUS.PENDING,
              id: orderId,
            });
          },
        });
        break;
      case ORDER_STATUS.PREPARING:
        setBtnStatus({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING],
          hasNext: true,
          onClick: () => {
            setContent({
              title: `${targetOrderProductCount}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리하시겠습니까?`,
              description: '선택한 주문의 상태가 일괄 변경됩니다',
              confirmText: '배송중 처리',
            });

            setTargetOrder({
              status: ORDER_STATUS.PREPARING,
              id: orderId,
            });
          },
        });
        break;
      case ORDER_STATUS.SHIPPING:
        setBtnStatus({
          btnText: ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED],
          hasNext: true,
          onClick: () => {
            setContent({
              title: `${targetOrderProductCount}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리하시겠습니까?`,
              description: '선택한 주문의 상태가 일괄 변경됩니다',
              confirmText: '배송완료 처리',
            });

            setTargetOrder({
              status: ORDER_STATUS.SHIPPING,
              id: orderId,
            });
          },
        });
        break;
      case ORDER_STATUS.DELIVERED:
        setBtnStatus({
          hasNext: false,
        });
        break;
    }
  }, [orderStatus]);

  if (!btnStatus?.hasNext) {
    return null;
  }

  return (
    <Button
      className="text-lg font-normal"
      disabled={!btnStatus?.hasNext}
      onClick={(e) => {
        btnStatus?.onClick?.();
        props.onClick?.(e);
      }}
    >
      {btnStatus?.btnText} 처리
    </Button>
  );
};

export default ProgressOrderActionButton;
