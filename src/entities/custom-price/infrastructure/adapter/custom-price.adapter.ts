import { FindOption, LoggerV2 } from '@/shared';
import {
  getTransactionContextFromStore,
  PayloadAdapterResultManager,
  PayloadCms,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { CUSTOM_PRICE_ERROR_MESSAGE } from '../../constants';
import { GetCustomPricesReponse } from '../../types';

export const CustomPriceAdapter = () => ({
  getCustomPrices: async (option: FindOption): Promise<GetCustomPricesReponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const { docs: customPrices } = await payload.find({
        collection: 'product-price',
        ...option,
        depth: 0,
        req,
      });
      console.log('customPrices');
      console.log(customPrices);
      return PayloadAdapterResultManager.ok(customPrices);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CUSTOM_PRICE_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
