import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { CartItem, CartItemEntity } from '../types';
import { CART_ITEM_ERROR_MESSAGE } from '../constants';
import { cartItemSchema, cartItemsSchema } from '../schemas';
import { PointItem, pointItemSchema } from '@/entities/point/@x/cart-item';

export class CartItemMapper {
  static entityToDomin(data: CartItemEntity): CartItem {
    const dto = {
      data,
      errorMsg: CART_ITEM_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(cartItemSchema, dto);
  }

  static entitiesToDomainList(data: CartItemEntity[]): CartItem[] {
    const dto = {
      data,
      errorMsg: CART_ITEM_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(cartItemsSchema, dto);
  }

  static toPointItem(cartItem: CartItem): PointItem {
    return ZodSchemaParser.safeParseOrThrow(pointItemSchema, {
      data: {
        rates: {
          creditCard: cartItem.product.cashback_rate,
          bankTransfer: cartItem.product.cashback_rate_for_bank,
        },
        price: cartItem.product.price,
        quantity: cartItem.quantity,
      },
      errorMsg: '포인트아이템으로 파싱하는데 문제가 발생했습니다',
    });
  }
}
