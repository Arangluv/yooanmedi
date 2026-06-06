import { BaseError, FindOption, LoggerV2 } from '@/shared';
import { PayloadAdapterResultManager, PayloadCmsErrorTranslator, PayloadCms } from '@/shared/server';
import { CreateCartItemDto, UpdateCartItemRequestDto } from '../../dto';
import { CART_ITEM_ERROR_MESSAGE } from '../../constants';
import {
  CreateCartItemResponse,
  GetCartItemsResponse,
  DeleteCartItemResponse,
  DeleteManyCartItemResponse,
  UpdateCartItemResponse,
} from '../../types';

export const CartItemAdapter = () => ({
  createCartItem: async (dto: CreateCartItemDto): Promise<CreateCartItemResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const createdItems = await payload.create({
        collection: 'cart-items',
        data: dto,
        populate: {
          carts: {},
        },
        depth: 1,
      });
      return PayloadAdapterResultManager.ok(createdItems);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ITEM_ERROR_MESSAGE.create);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getCartItems: async (option: FindOption): Promise<GetCartItemsResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const { docs: cartItems } = await payload.find({
        collection: 'cart-items',
        ...option,
        populate: {
          carts: {},
        },
        depth: 1,
      });
      return PayloadAdapterResultManager.ok(cartItems);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ITEM_ERROR_MESSAGE.fetchfail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  updateCartItem: async (dto: UpdateCartItemRequestDto): Promise<UpdateCartItemResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const updatedItem = await payload.update({
        collection: 'cart-items',
        id: dto.cartItem,
        data: dto.data,
        populate: {
          carts: {},
        },
        depth: 1,
      });
      return PayloadAdapterResultManager.ok(updatedItem);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ITEM_ERROR_MESSAGE.update);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  deleteCartItem: async (id: number): Promise<DeleteCartItemResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const deletedItem = await payload.delete({
        collection: 'cart-items',
        id,
        populate: {
          carts: {},
        },
        depth: 1,
      });
      return PayloadAdapterResultManager.ok(deletedItem);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ITEM_ERROR_MESSAGE.delete);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  deleteManyCartItem: async (ids: number[]): Promise<DeleteManyCartItemResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const deleteManyResult = await payload.delete({
        collection: 'cart-items',
        where: {
          id: {
            in: ids,
          },
        },
        populate: {
          carts: {},
        },
        depth: 1,
      });

      const nomalizedResult = PayloadAdapterResultManager.normalizeBulkOperationResult(deleteManyResult);
      if (!nomalizedResult.ok) {
        const error = new BaseError({
          clientMsg: `주문 상품을 업데이트하는데 문제가 발생했습니다 ${nomalizedResult.successCount} / ${nomalizedResult.totalCount}`,
          devMsg: `orderProduct update fail \n ${JSON.stringify(nomalizedResult.FailedData, null, 2)}`,
          errorName: 'CartItemDeleteError',
        });
        return PayloadAdapterResultManager.fail(error);
      }

      return PayloadAdapterResultManager.ok(nomalizedResult.successData);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ITEM_ERROR_MESSAGE.delete);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
