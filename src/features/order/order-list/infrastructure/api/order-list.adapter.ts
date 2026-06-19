import { FindOption } from '@/shared';
import {
  getPayload,
  getTransactionContextFromStore,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { GetAdminOrderListReponse, GetClientOrderListResponse } from '../../types';

export const OrderListAdapter = () => ({
  getAdminOrderList: async (option: FindOption): Promise<GetAdminOrderListReponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const response = await payload.find({
        collection: 'order',
        ...option,
        populate: {
          'order-product': {
            orderProductStatus: true,
          },
        },
        req,
      });
      return PayloadAdapterResultManager.okWithPaginated(response);
    } catch (error) {
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '주문리스트를 불러오는데 문제가 발생했습니다',
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getClientOrderList: async (option: FindOption): Promise<GetClientOrderListResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();

      const { docs: orderDocs } = await payload.find({
        collection: 'order',
        ...option,
        populate: {
          'order-product': {
            productNameSnapshot: true,
            priceSnapshot: true,
            quantity: true,
            productDeliveryFee: true,
            orderProductStatus: true,
            product: true,
          },
          product: {
            manufacturer: true,
            insurance_code: true,
            image: true,
          },
        },
        req,
      });

      return PayloadAdapterResultManager.ok(orderDocs);
    } catch (error) {
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '주문리스트를 불러오는데 문제가 발생했습니다',
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
