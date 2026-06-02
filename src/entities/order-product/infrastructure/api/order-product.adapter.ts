import { BaseError, FindOption, LoggerV2, PayloadOrderProductSelect } from '@/shared';
import {
  PayloadCms,
  PayloadAdapterResultManager,
  PayloadCmsErrorTranslator,
  getTransactionContextFromStore,
} from '@/shared/server';
import { ORDER_PRODUCT_ERROR_MESSAGE } from '../../constants';
import {
  CreateOrderProductRequestDto,
  UpdateOrderProductRequestDto,
  BulkUpdateOrderProductRequestDto,
} from '../../dto';
import {
  BulkUpdateOrderProductResponse,
  CreateOrderProductResponse,
  GetOrderProductResponse,
  GetOrderProductsResponse,
  UpdateOrderProductResponse,
} from '../../types';

const ORDER_PRODUCT_SELECT: PayloadOrderProductSelect = {
  order: true,
  product: true,
  totalAmount: true,
  productDeliveryFee: true,
  orderProductStatus: true,
  priceSnapshot: true,
  productNameSnapshot: true,
  quantity: true,
  cashback_rate: true,
  cashback_rate_for_bank: true,
} as const;

export const OrderProductAdapter = () => ({
  createOrderProduct: async (dto: CreateOrderProductRequestDto): Promise<CreateOrderProductResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const result = await payload.create({
        collection: 'order-product',
        select: ORDER_PRODUCT_SELECT,
        depth: 0,
        data: dto,
        req,
      });

      return PayloadAdapterResultManager.ok(result);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_PRODUCT_ERROR_MESSAGE.create);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getOrderProductById: async (orderProductId: number): Promise<GetOrderProductResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const result = await payload.findByID({
        collection: 'order-product',
        id: orderProductId,
        select: ORDER_PRODUCT_SELECT,
        depth: 0,
        req,
      });

      return PayloadAdapterResultManager.ok(result);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_PRODUCT_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getOrderProducts: async (option: FindOption): Promise<GetOrderProductsResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const { docs } = await payload.find({
        collection: 'order-product',
        select: ORDER_PRODUCT_SELECT,
        depth: 0,
        ...option,
        req,
      });

      return PayloadAdapterResultManager.ok(docs);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_PRODUCT_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  updateOrderProduct: async (dto: UpdateOrderProductRequestDto): Promise<UpdateOrderProductResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const result = await payload.update({
        collection: 'order-product',
        select: ORDER_PRODUCT_SELECT,
        depth: 0,
        id: dto.orderProductId,
        data: dto.data,
        req,
      });

      return PayloadAdapterResultManager.ok(result);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_PRODUCT_ERROR_MESSAGE.update);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  bulkUpdateOrderProduct: async (dto: BulkUpdateOrderProductRequestDto): Promise<BulkUpdateOrderProductResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const result = await payload.update({
        collection: 'order-product',
        select: ORDER_PRODUCT_SELECT,
        depth: 0,
        where: {
          id: {
            in: dto.orderProductIds,
          },
        },
        data: dto.data,
        req,
      });
      const nomalizedResult = PayloadAdapterResultManager.normalizeBulkOperationResult(result);
      if (!nomalizedResult.ok) {
        const error = new BaseError({
          clientMsg: `주문 상품을 업데이트하는데 문제가 발생했습니다 ${nomalizedResult.successCount} / ${nomalizedResult.totalCount}`,
          devMsg: `orderProduct update fail \n ${JSON.stringify(nomalizedResult.FailedData, null, 2)}`,
          errorName: 'OrderProductUpdateError',
        });
        return PayloadAdapterResultManager.fail(error);
      }

      return PayloadAdapterResultManager.ok(nomalizedResult.successData);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, ORDER_PRODUCT_ERROR_MESSAGE.update);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
