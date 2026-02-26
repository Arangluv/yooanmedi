'use client';

import { useEffect, useState } from 'react';
import { RowSelectionState } from '@tanstack/react-table';

import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';

import { useOrderListDialog } from './dialog-providers';
import useOrderListSearch from './useOrderListSearch';
import { UpdateOrderActionType } from './types';
import { updateScenarioResolver } from '../lib/update/scenario-resolver';

const useOrderStatusAction = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { filters } = useOrderListSearch();
  const { setContent, onOpen, setActionType, setTargetOrderIds } = useOrderListDialog();
  const [btnNextStepText, setBtnNextStepText] = useState<string>('주문처리');

  const onActionClick = (status: UpdateOrderActionType, count: number) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        setContent({
          title: `${count}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.PREPARING]} 처리`,
        });
        setActionType({
          type: 'update',
          scenario: updateScenarioResolver(status),
        });

        setTargetOrderIds(Object.keys(selectedRows).map((key) => parseInt(key)));
        onOpen();
        break;

      case ORDER_STATUS.PREPARING:
        setContent({
          title: `${count}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING]} 처리`,
        });
        setActionType({
          type: 'update',
          scenario: updateScenarioResolver(status),
        });
        setTargetOrderIds(Object.keys(selectedRows).map((key) => parseInt(key)));
        onOpen();
        break;

      case ORDER_STATUS.SHIPPING:
        setContent({
          title: `${count}개의 상품을 ${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: `${ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED]} 처리`,
        });
        setActionType({
          type: 'update',
          scenario: updateScenarioResolver(status),
        });
        setTargetOrderIds(Object.keys(selectedRows).map((key) => parseInt(key)));
        onOpen();
        break;
    }
  };

  useEffect(() => {
    const currentOrderStatus = filters.orderStatus as UpdateOrderActionType;

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
