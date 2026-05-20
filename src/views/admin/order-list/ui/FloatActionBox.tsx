'use client';

import { Row } from '@tanstack/react-table';
import useOrderListSearch from '../model/useOrderListSearch';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { TransitionDialogTrigger, CancelDialogTrigger } from './dialogs';
import { AdminOrderListItemDto } from '@/features/order/order-list';

const FloatActionBox = ({ selectedRows }: { selectedRows: Row<AdminOrderListItemDto>[] }) => {
  const { filters } = useOrderListSearch();

  // 체크박스가 없는 상태에서는 플로팅 액션 박스를 보여주지 않음
  if (
    filters.orderStatus === 'all' ||
    filters.orderStatus === ORDER_STATUS.cancelled ||
    filters.orderStatus === ORDER_STATUS.cancel_request
  ) {
    return null;
  }

  // 선택된 행이 없는 상태에서는 플로팅 액션 박스를 보여주지 않음
  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-1/2 bottom-12 z-50 translate-x-1/2">
      <div className="bg-foreground dark:bg-background flex items-center gap-4 rounded-xl p-4">
        <CancelDialogTrigger selectedRows={selectedRows} />
        <TransitionDialogTrigger selectedRows={selectedRows} />
      </div>
    </div>
  );
};

export default FloatActionBox;
