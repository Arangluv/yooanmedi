import { BasePayload } from 'payload';
import { validateCancellableOrderProduct, type CancelOrderProduct } from '@/entities/order-product';

import { bankTransferScenarioResolver } from './scenario';
import { bankTransferScenarioActions } from './actions';

export type CancelBankTransferStrategyParams = {
  payload: BasePayload;
  orderProduct: CancelOrderProduct;
};

export const cancelBankTransferStrategy = {
  execute: async ({ payload, orderProduct }: CancelBankTransferStrategyParams) => {
    try {
      validateCancellableOrderProduct(orderProduct);

      const scenario = bankTransferScenarioResolver(orderProduct);
      await bankTransferScenarioActions[scenario]({ payload, orderProduct });
    } catch (error) {
      throw error;
    }
  },
};
