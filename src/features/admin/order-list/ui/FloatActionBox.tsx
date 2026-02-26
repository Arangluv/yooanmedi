import useOrderListSearch from '../model/useOrderListSearch';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import OrderStatusActionButton from './orderStatusActionButton';
import CancelOrderListButton from './cancelOrderListButton';
import { RowSelectionState } from '@tanstack/react-table';

const FloatActionBox = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { filters } = useOrderListSearch();

  // 체크박스가 없는 상태에서는 플로팅 액션 박스를 보여주지 않음
  if (filters.orderStatus === 'all' || filters.orderStatus === ORDER_STATUS.CANCELLED) {
    return null;
  }

  // 선택된 행이 없는 상태에서는 플로팅 액션 박스를 보여주지 않음
  if (Object.keys(selectedRows).length === 0) {
    return null;
  }

  return (
    <div className="fixed right-1/2 bottom-12 z-50 translate-x-1/2">
      <div className="bg-foreground flex items-center gap-4 rounded-xl p-4">
        <OrderStatusActionButton selectedRows={selectedRows} />
        <CancelOrderListButton selectedRows={selectedRows} />
      </div>
    </div>
  );
};

export default FloatActionBox;
