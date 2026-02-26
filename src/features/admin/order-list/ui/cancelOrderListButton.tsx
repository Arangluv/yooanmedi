'use client';

import { RowSelectionState } from '@tanstack/react-table';

import { Button } from '@/shared/ui/shadcn/button';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';

import { CancelOrderActionType } from '../model/types';
import { useOrderListDialog } from '../model/dialog-providers';
import useOrderListSearch from '../model/useOrderListSearch';
import { cancelScenarioResolver } from '../lib/cancel/scenario-resolver';

const CancelOrderListButton = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { setContent, onOpen, setActionType, setTargetOrderIds } = useOrderListDialog();
  const { filters } = useOrderListSearch();

  return (
    <Button
      variant="ghost"
      className="bg-muted rounded-xl px-4 py-6"
      onClick={() => {
        setContent({
          title: `${Object.keys(selectedRows).length}개의 주문을 ${ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED]} 처리하시겠습니까?`,
          description: '선택한 주문의 상태가 일괄 변경됩니다',
          confirmText: '취소처리',
        });
        setActionType({
          type: 'cancel',
          scenario: cancelScenarioResolver(filters.orderStatus as CancelOrderActionType),
        });
        setTargetOrderIds(Object.keys(selectedRows).map((key) => parseInt(key)));
        onOpen();
      }}
    >
      <span className="text-muted-foreground text-lg font-normal">취소처리</span>
    </Button>
  );
};

export default CancelOrderListButton;
