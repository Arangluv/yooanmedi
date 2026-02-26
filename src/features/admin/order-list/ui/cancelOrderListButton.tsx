'use client';

import { Button } from '@/shared/ui/shadcn/button';
import { useOrderListDialog } from '../model/dialog-providers';
import useOrderListSearch from '../model/useOrderListSearch';
import { RowSelectionState } from '@tanstack/react-table';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';

const CancelOrderListButton = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { setContent, onOpen } = useOrderListDialog();

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
        onOpen();
      }}
    >
      <span className="text-muted-foreground text-lg font-normal">취소처리</span>
    </Button>
  );
};

export default CancelOrderListButton;
