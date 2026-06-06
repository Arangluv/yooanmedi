import { Cart } from '@/entities/cartv2';
import { CartItem } from '@/entities/cart-item';
import { CustomPrice, CustomPriceUtil } from '@/entities/custom-price';
import { CartDetail } from '../types';
import { CartDetailError } from '../libs';
import { CustomPricedCartItemDto } from '../dto';

export class CartAssembler {
  /** 개별설정 가격을 cartItem에 적용하여 반환하는 함수 */
  static applyCustomPrice(cartItems: CartItem[], customPrices: CustomPrice[]): CustomPricedCartItemDto[] {
    const customPriceMap = CustomPriceUtil.toMapKeyedByProductId(customPrices);

    return cartItems.map((item) => {
      const customPrice = customPriceMap.get(item.product.id)?.price;
      if (customPrice === undefined) {
        throw CartDetailError.customPriceNotFound();
      }

      const updatedProduct = {
        ...item.product,
        price: customPrice,
      };
      return {
        ...item,
        product: updatedProduct,
        isProcessed: true,
      };
    });
  }

  static toCartDetail(cart: Cart, cartItems: CustomPricedCartItemDto[]): CartDetail {
    return { ...cart, cartItems };
  }
}
