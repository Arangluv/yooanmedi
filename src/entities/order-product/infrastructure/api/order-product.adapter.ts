import {
  PayloadCms,
  PayloadAdapterResult,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { ORDER_PRODUCT_ERROR_MESSAGE } from '../../constants';
import { LoggerV2 } from '@/shared';

const payload = await PayloadCms.getInstance();

export const OrderProductAdapter = () => ({
  createOrderProduct: async () => {
    try {
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_PRODUCT_ERROR_MESSAGE.create);
      PayloadAdapterResultManager.fail(baseError);
    }
  },

  getOrderProductById: async () => {},

  getOrderProducts: async () => {},

  updateOrderProduct: async () => {},
});
