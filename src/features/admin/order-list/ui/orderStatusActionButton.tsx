'use client';

import { RowSelectionState } from '@tanstack/react-table';

import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { Button } from '@/shared/ui/shadcn/button';

import useOrderListSearch from '../model/useOrderListSearch';
import useOrderStatusAction from '../model/useOrderStatusAction';
import { UpdateOrderActionType } from '../model/types';

const OrderStatusActionButton = ({ selectedRows }: { selectedRows: RowSelectionState }) => {
  const { filters } = useOrderListSearch();
  const { btnNextStepText, onActionClick } = useOrderStatusAction({ selectedRows });

  if (filters.orderStatus === ORDER_STATUS.CANCEL_REQUEST) {
    return null;
  }

  return (
    <Button
      className="bg-secondary rounded-xl px-4 py-6"
      onClick={() =>
        onActionClick(
          filters.orderStatus as UpdateOrderActionType,
          Object.keys(selectedRows).length,
        )
      }
    >
      <span className="text-secondary-foreground text-lg font-normal">{btnNextStepText}</span>
    </Button>
  );
};

export default OrderStatusActionButton;
