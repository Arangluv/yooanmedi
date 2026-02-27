import { CANCEL_SCENARIO, CancelScenario } from '../../constants/scenario';
import { cancelAction } from './action';
import { OnlyPaidOrderCancelOrderActionType } from '../../model/types';

export const cancelStrategy = {
  execute: async ({
    scenario,
    targetOrderIds,
    currentOrderStatus,
  }: {
    scenario: CancelScenario;
    targetOrderIds: number[];
    currentOrderStatus: OnlyPaidOrderCancelOrderActionType;
  }) => {
    if (scenario === CANCEL_SCENARIO.PAID_ORDER_TO_CANCELLED) {
      console.log('시나리오를 탑니다');
      
      await cancelAction[scenario]({ targetOrderIds, orderStatus: currentOrderStatus });
      return;
    }

    await cancelAction[scenario]({ targetOrderIds });
  },
};
