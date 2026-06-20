import { LoggerV2 } from '@/shared';
import {
  getPayload,
  getTransactionContextFromStore,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { GetOrderDetailRequestDto } from '../../dto';
import { GetOrderDetailResponse } from '../../types';

export const OrderDetailAdapter = () => ({
  getOrderDetail: async (dto: GetOrderDetailRequestDto): Promise<GetOrderDetailResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const orderDetail = await payload.findByID({
        collection: 'order',
        id: dto.order,
        depth: 4,
        populate: {
          'order-product': {
            product: true,
            orderProductStatus: true,
            productNameSnapshot: true,
            priceSnapshot: true,
            totalAmount: true,
            productDeliveryFee: true,
            quantity: true,
            cashback_rate: true,
            cashback_rate_for_bank: true,
          },
        },
        req,
      });
      return PayloadAdapterResultManager.ok(orderDetail);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        '주문 상세내역을 불러오는데 문제가 발생했습니다',
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
