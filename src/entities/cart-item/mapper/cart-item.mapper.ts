import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { CartItem, CartItemEntity } from '../types';
import { CART_ITEM_ERROR_MESSAGE } from '../constants';
import { cartItemSchema, cartItemsSchema } from '../schemas';

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
}
