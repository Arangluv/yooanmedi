import { CartAdapter, CartApiRepository } from '@/entities/cartv2/infrastructure';
import { CartItemAdapter, CartItemApiRepository } from '@/entities/cart-item/infrastructure';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import {
  CustomPriceAdapter,
  CustomPriceApiRepository,
} from '@/entities/custom-price/infrastructure';
import { CartDetailService } from './cart.service';
import { CartUseCase } from '../../usecases';

export const createCartUseCase = (): CartUseCase => {
  const cartRepository = new CartApiRepository(CartAdapter());
  const cartItemRepository = new CartItemApiRepository(CartItemAdapter());
  const userRepository = new UserApiRepository(UserAdapter());
  const customPriceRepository = new CustomPriceApiRepository(CustomPriceAdapter());

  return CartDetailService({
    repository: {
      cart: cartRepository,
      cartItem: cartItemRepository,
      user: userRepository,
      customPrice: customPriceRepository,
    },
  });
};
