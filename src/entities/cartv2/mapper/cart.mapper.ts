import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { Cart, CartEntity } from '../types';
import { CART_ERROR_MESSAGE } from '../constants';
import { cartSchema } from '../schemas';

export class CartMapper {
  static entityToDomin(data: CartEntity): Cart {
    const dto = {
      data,
      errorMsg: CART_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(cartSchema, dto);
  }
}
