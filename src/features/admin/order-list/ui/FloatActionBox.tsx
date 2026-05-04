'use client';

import useOrderListSearch from '../model/useOrderListSearch';
import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { RowSelectionState } from '@tanstack/react-table';
import { OrderAction } from '@/features/admin/order-detail/model/order-action-dialog-provider';

const FloatActionBox = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { filters } = useOrderListSearch();

  // 체크박스가 없는 상태에서는 플로팅 액션 박스를 보여주지 않음
  if (filters.orderStatus === 'all' || filters.orderStatus === ORDER_STATUS.cancelled) {
    return null;
  }

  // 선택된 행이 없는 상태에서는 플로팅 액션 박스를 보여주지 않음
  if (Object.keys(selectedRows).length === 0) {
    return null;
  }

  return (
    <div className="fixed right-1/2 bottom-12 z-50 translate-x-1/2">
      <div className="bg-foreground dark:bg-background flex items-center gap-4 rounded-xl p-4">
        <OrderAction.ProceedTrigger
          display={{
            count: Object.keys(selectedRows).length,
            viewType: 'order-list',
          }}
          targetOrderIds={Object.keys(selectedRows).map((key) => parseInt(key))}
          currentStatus={filters.orderStatus as OrderStatus}
        />
        <OrderAction.ProceedContent />
        <OrderAction.CancelTrigger
          display={{
            count: Object.keys(selectedRows).length,
            viewType: 'order-list',
          }}
          targetOrderIds={Object.keys(selectedRows).map((key) => parseInt(key))}
          currentStatus={filters.orderStatus as OrderStatus}
        />
        <OrderAction.CancelContent />
      </div>
    </div>
  );
};

export default FloatActionBox;
