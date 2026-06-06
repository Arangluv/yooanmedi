import { BaseErrorManager, LoggerV2 } from '@/shared';
import { CartRepository } from '@/entities/cartv2';
import { CartItemRepository, CreateCartItemDto } from '@/entities/cart-item';
import { UserRepository } from '@/entities/user';
import { CustomPriceRepository } from '@/entities/custom-price';
import { CartDetailError, CartDetailFindOption } from '../../libs';
import { CartAssembler, CartDetailItemMapper } from '../../mapper';
import { CartUseCase } from '../../usecase';
import { CART_DETAIL_ERROR_MESSAGE } from '../../constants';
import { DeleteCartItemToCartRequestDto, SaveCartChangeRequestDto } from '../../dto';

interface CartServiceDependencies {
  repository: {
    cart: CartRepository;
    cartItem: CartItemRepository;
    user: UserRepository;
    customPrice: CustomPriceRepository;
  };
}

export const CartService = ({ repository }: CartServiceDependencies): CartUseCase => ({
  getCart: async () => {
    try {
      const user = await repository.user.findByHeader();
      const cart = await repository.cart.findOneByUserId(user.id);
      const cartItems = await repository.cartItem.findMany(CartDetailFindOption.cartItems(cart));
      const customPrices = await repository.customPrice.findMany(CartDetailFindOption.customPrice(cart));

      const customPricedCartItems = CartAssembler.applyCustomPrice(cartItems, customPrices);
      return CartAssembler.toCartDetail(cart, customPricedCartItems);
    } catch (error) {
      LoggerV2.error(error);
      const message = BaseErrorManager.resolveClientMessage(error);
      throw CartDetailError.fetchError(message ?? CART_DETAIL_ERROR_MESSAGE.fetchFail);
    }
  },

  addToCart: async (dto: CreateCartItemDto) => {
    try {
      return await repository.cartItem.create(dto);
    } catch (error) {
      LoggerV2.error(error);
      throw CartDetailError.addToCart();
    }
  },

  saveCartChanges: async (dto: SaveCartChangeRequestDto) => {
    try {
      const requestDtos = CartDetailItemMapper.toDomainUpdateRequestDtoList(dto);
      return await Promise.all(
        requestDtos.map(async (dto) => {
          return await repository.cartItem.update(dto);
        }),
      );
    } catch (error) {
      LoggerV2.error(error);
      throw CartDetailError.addToCart();
    }
  },

  deleteFromCart: async (dto: DeleteCartItemToCartRequestDto) => {
    try {
      return await repository.cartItem.delete(dto.id);
    } catch (error) {
      LoggerV2.error(error);
      throw CartDetailError.deleteToCart();
    }
  },

  clearCart: async (cartId: number) => {
    try {
      const cartItems = await repository.cartItem.findMany(CartDetailFindOption.allCartItem(cartId));
      const ids = cartItems.map((item) => item.id);
      return await repository.cartItem.deleteMany(ids);
    } catch (error) {
      LoggerV2.error(error);
      throw CartDetailError.deleteToCart();
    }
  },
});
