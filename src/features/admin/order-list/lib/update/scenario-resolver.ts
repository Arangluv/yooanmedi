import { ORDER_STATUS } from '@/entities/order/constants/order-status';

import { UpdateOrderActionType } from '../../model/types';
import { UPDATE_SCENARIO } from '../../constants/scenario';

export const updateScenarioResolver = (currentStatus: UpdateOrderActionType) => {
  switch (currentStatus) {
    case ORDER_STATUS.PENDING:
      return UPDATE_SCENARIO.PENDING_TO_PREPARING;

    case ORDER_STATUS.PREPARING:
      return UPDATE_SCENARIO.PREPARING_TO_SHIPPING;

    case ORDER_STATUS.SHIPPING:
      return UPDATE_SCENARIO.SHIPPING_TO_DELIVERED;

    default:
      throw new Error('잘못된 주문 상태입니다.');
  }
};
