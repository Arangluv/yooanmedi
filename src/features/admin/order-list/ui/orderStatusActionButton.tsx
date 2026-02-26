'use client';

import { RowSelectionState } from '@tanstack/react-table';

import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { Button } from '@/shared/ui/shadcn/button';

import useOrderListSearch from '../model/useOrderListSearch';
import useOrderStatusAction, { ActionableOrderStatus } from '../model/useOrderStatusAction';

const OrderStatusActionButton = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { filters } = useOrderListSearch();
  const { btnNextStepText, onActionClick } = useOrderStatusAction();

  if (filters.orderStatus === ORDER_STATUS.CANCEL_REQUEST) {
    return null;
  }

  return (
    <Button
      className="bg-secondary rounded-xl px-4 py-6"
      onClick={() =>
        onActionClick(
          filters.orderStatus as ActionableOrderStatus,
          Object.keys(selectedRows).length,
        )
      }
    >
      <span className="text-secondary-foreground text-lg font-normal">{btnNextStepText}</span>
    </Button>
  );
};

export default OrderStatusActionButton;
