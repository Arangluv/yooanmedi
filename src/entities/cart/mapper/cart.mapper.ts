import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { Cart, CartEntity, OperatorResultCart } from '../types';
import { CART_ERROR_MESSAGE } from '../constants';
import { cartSchema, operatorResultCartSchema } from '../schemas';

export class CartMapper {
  static entityToDomin(data: CartEntity): Cart {
    const dto = {
      data: {
        ...data,
        cartItems: data.cartItems?.docs,
      },
      errorMsg: CART_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(cartSchema, dto);
  }

  static toOperatorResult(data: CartEntity): OperatorResultCart {
    return ZodSchemaParser.safeParseOrThrow(operatorResultCartSchema, {
      data,
      errorMsg: CART_ERROR_MESSAGE.invalidData,
    });
  }
}
