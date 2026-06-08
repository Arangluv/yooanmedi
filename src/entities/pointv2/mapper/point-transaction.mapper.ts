import { PAYMENTS_METHOD, ZodSchemaParser, SchemaParserDto } from '@/shared';
import { PointItem, PointTransaction, PointTransactionEntity } from '../types';
import { pointItemListSchema, pointItemSchema, pointTransactionSchema } from '../schemas';
import { Product } from '@/entities/product/@x/point';
import { CartItem } from '@/entities/cart-item/@x/point';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../constants';

export class PointTransactionMapper {
  static entityToDomain(data: PointTransactionEntity): PointTransaction {
    const schemaDto: SchemaParserDto = {
      data,
      errorMsg: POINT_TRANSACTION_ERROR_MESSAGE.create,
    };

    return ZodSchemaParser.safeParseOrThrow(pointTransactionSchema, schemaDto);
  }

  static productToPointItem(product: Product, quantity: number): PointItem {
    const schemaDto: SchemaParserDto = {
      data: {
        rates: {
          [PAYMENTS_METHOD.bank_transfer]: product.cashback_rate_for_bank,
          [PAYMENTS_METHOD.credit_card]: product.cashback_rate,
        },
        price: product.price,
        quantity,
      },
      errorMsg: POINT_TRANSACTION_ERROR_MESSAGE.mapper.productToPointItem,
    };

    return ZodSchemaParser.safeParseOrThrow(pointItemSchema, schemaDto);
  }

  static cartItemListToPointItemList(cartItemList: CartItem[]): PointItem[] {
    const schemaDto: SchemaParserDto = {
      data: cartItemList.map((item) => {
        return {
          rates: {
            [PAYMENTS_METHOD.bank_transfer]: item.product.cashback_rate_for_bank,
            [PAYMENTS_METHOD.credit_card]: item.product.cashback_rate,
          },
          quantity: item.quantity,
          price: item.product.price,
        };
      }),
      errorMsg: POINT_TRANSACTION_ERROR_MESSAGE.mapper.cartItemListToPointItemList,
    };

    return ZodSchemaParser.safeParseOrThrow(pointItemListSchema, schemaDto);
  }
}
