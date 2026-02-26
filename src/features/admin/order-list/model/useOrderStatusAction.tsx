'use client';

import { useEffect, useState } from 'react';
import useOrderListSearch from './useOrderListSearch';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';
import { useOrderListDialog } from './dialog-providers';

export type ActionableOrderStatus =
  | typeof ORDER_STATUS.PENDING
  | typeof ORDER_STATUS.PREPARING
  | typeof ORDER_STATUS.SHIPPING;

const useOrderStatusAction = () => {
  const { filters } = useOrderListSearch();
  const { setContent, onOpen } = useOrderListDialog();
  const [btnNextStepText, setBtnNextStepText] = useState<string>('주문처리');

  const onActionClick = (status: ActionableOrderStatus, count: number) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        setContent({
          title: `${count}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리`,
        });
        onOpen();
        break;
      case ORDER_STATUS.PREPARING:
        setContent({
          title: `${count}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리`,
        });
        onOpen();
        break;
      case ORDER_STATUS.SHIPPING:
        setContent({
          title: `${count}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리`,
        });
        onOpen();
        break;
    }
  };

  useEffect(() => {
    const currentOrderStatus = filters.orderStatus as ActionableOrderStatus;

    switch (currentOrderStatus) {
      case ORDER_STATUS.PENDING:
        setBtnNextStepText(`${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리`);
        break;
      case ORDER_STATUS.PREPARING:
        setBtnNextStepText(`${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리`);
        break;
      case ORDER_STATUS.SHIPPING:
        setBtnNextStepText(`${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리`);
        break;
    }
  }, [filters.orderStatus]);

  return {
    btnNextStepText,
    onActionClick,
  };
};

export default useOrderStatusAction;
