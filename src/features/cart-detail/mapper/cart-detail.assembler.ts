import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { Cart } from '@/entities/cart';
import { CartItem } from '@/entities/cart-item';
import { CustomPrice, CustomPriceUtil } from '@/entities/custom-price';
import { CartDetail } from '../types';
import { CartDetailError } from '../libs';
import { CartDetailItemDto } from '../dto';
import { CART_DETAIL_ERROR_MESSAGE } from '../constants';
import { cartDetailSchema, customPricedCartItemsSchema } from '../schemas';

export class CartDetailAssembler {
  /** 개별설정 가격을 cartItem에 적용하여 반환하는 함수 */
  static applyCustomPrice(cartItems: CartItem[], customPrices: CustomPrice[]): CartDetailItemDto[] {
    const customPriceMap = CustomPriceUtil.toMapKeyedByProductId(customPrices);
    const dto = {
      data: cartItems.map((item) => {
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
      }),
      errorMsg: CART_DETAIL_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(customPricedCartItemsSchema, dto);
  }

  static toCartDetail(cart: Cart, cartItems: CartDetailItemDto[]): CartDetail {
    const dto = {
      data: { ...cart, cartItems },
      errorMsg: CART_DETAIL_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(cartDetailSchema, dto);
  }
}
