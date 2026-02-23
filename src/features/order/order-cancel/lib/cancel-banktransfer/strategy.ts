import { BasePayload } from 'payload';
import { validateCancellableOrderProduct, type CancelOrderProduct } from '@/entities/order-product';

import { bankTransferScenarioResolver } from './scenario';
import { bankTransferScenarioActions } from './actions';

export type CancelBankTransferStrategyParams = {
  payload: BasePayload;
  orderProduct: CancelOrderProduct;
  clientSideFlg: boolean;
};

export const cancelBankTransferStrategy = {
  execute: async ({ payload, orderProduct, clientSideFlg }: CancelBankTransferStrategyParams) => {
    try {
      validateCancellableOrderProduct(orderProduct);

      const scenario = bankTransferScenarioResolver(orderProduct, clientSideFlg);
      console.log('scenario');
      console.log(scenario);
      await bankTransferScenarioActions[scenario]({ payload, orderProduct, clientSideFlg });
    } catch (error) {
      throw error;
    }
  },
};
