import { cartItemSchema, cartItemsSchema, UpdateCartItemRequestDto } from '@/entities/cart-item';
import { CartDetailItemDto } from '../dto';
import { ZodSchemaParser, SchemaParserDto } from '@/shared';

export class CartDetailItemMapper {
  static toDomainUpdateRequestDto(data: CartDetailItemDto): UpdateCartItemRequestDto {
    const dto = {
      data,
      errorMsg: '올바르지 않은 장바구니 아이템 데이터입니다',
    } as SchemaParserDto;
    const cartItem = ZodSchemaParser.safeParseOrThrow(cartItemSchema, dto);

    return {
      cartItem: cartItem.id,
      data: {
        quantity: cartItem.quantity,
      },
    };
  }

  static toDomainUpdateRequestDtoList(data: CartDetailItemDto[]): UpdateCartItemRequestDto[] {
    const dto = {
      data,
      errorMsg: '올바르지 않은 장바구니 아이템 데이터입니다',
    } as SchemaParserDto;
    const cartItems = ZodSchemaParser.safeParseOrThrow(cartItemsSchema, dto);

    return cartItems.map((item) => ({
      cartItem: item.id,
      data: {
        quantity: item.quantity,
      },
    }));
  }
}
