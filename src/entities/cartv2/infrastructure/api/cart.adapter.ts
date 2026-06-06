import { LoggerV2 } from '@/shared';
import { PayloadAdapterResultManager, PayloadCms, PayloadCmsErrorTranslator } from '@/shared/server';
import { CreateCartDto } from '../../dto';
import { CART_ERROR_MESSAGE } from '../../constants';
import { CartError } from '../../libs';
import { GetCartResponse, CreateCartResponse } from '../../types';

export const CartAdapter = () => ({
  createCart: async (dto: CreateCartDto): Promise<CreateCartResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const createdCart = await payload.create({
        collection: 'carts',
        data: dto,
        depth: 0,
      });
      return PayloadAdapterResultManager.ok(createdCart);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ERROR_MESSAGE.create);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getCartByUserId: async (userId: number): Promise<GetCartResponse> => {
    try {
      const payload = await PayloadCms.getInstance();
      const { docs: cart } = await payload.find({
        collection: 'carts',
        where: {
          user: {
            equals: userId,
          },
        },
        depth: 0,
      });

      if (cart.length > 1) {
        const error = CartError.invalidUserId(userId);
        throw error;
      }

      return PayloadAdapterResultManager.ok(cart[0]);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, CART_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
