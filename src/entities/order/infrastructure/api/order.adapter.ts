import { LoggerV2 } from '@/shared';
import {
  getPayload,
  getTransactionContextFromStore,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { ORDER_ERROR_MESSAGE } from '../../constants';
import { CreateOrderRequestDto, UpdateOrderRequestDto } from '../../dto';
import { GetOrderResponse, UpdateOrderResponse, CreateOrderResponse } from '../../types';

export const OrderAdapter = () => ({
  createOrder: async (dto: CreateOrderRequestDto): Promise<CreateOrderResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const order = await payload.create({
        collection: 'order',
        data: dto,
        depth: 0,
        req,
      });

      return PayloadAdapterResultManager.ok(order);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_ERROR_MESSAGE.create);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getOrderById: async (id: number): Promise<GetOrderResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const order = await payload.findByID({
        collection: 'order',
        id,
        depth: 0,
        req,
      });
      return PayloadAdapterResultManager.ok(order);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  updateOrder: async (dto: UpdateOrderRequestDto): Promise<UpdateOrderResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const order = await payload.update({
        collection: 'order',
        id: dto.order,
        data: dto.data,
        depth: 0,
        req,
      });
      return PayloadAdapterResultManager.ok(order);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
