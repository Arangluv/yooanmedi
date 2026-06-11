import { PAYMENTS_METHOD, ZodSchemaParser, SchemaParserDto } from '@/shared';
import { PointItem, PointHistory, PointHistoryEntity, CreatePointHistoryEntity } from '../types';
import { pointItemListSchema, pointItemSchema, pointHistorySchema } from '../schemas';
import { Product } from '@/entities/product/@x/point';
import { CartItem } from '@/entities/cart-item/@x/point';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../constants';
import { CreateRollbackPointHistoryRequestDto } from '../dto';

export class PointHistoryMapper {
  static toRequestEntity({
    dto,
    rollbackHistory,
  }: {
    dto: CreateRollbackPointHistoryRequestDto;
    rollbackHistory: PointHistory;
  }): CreatePointHistoryEntity {
    return ZodSchemaParser.safeParseOrThrow(pointHistorySchema, {
      data: {
        user: dto.user,
        type: dto.type,
        orderProduct: dto.orderProduct,
        amount: rollbackHistory.amount,
      } as CreatePointHistoryEntity,
      errorMsg: POINT_TRANSACTION_ERROR_MESSAGE.create,
    });
  }

  static entityToDomain(data: PointHistoryEntity): PointHistory {
    const schemaDto: SchemaParserDto = {
      data,
      errorMsg: POINT_TRANSACTION_ERROR_MESSAGE.create,
    };

    return ZodSchemaParser.safeParseOrThrow(pointHistorySchema, schemaDto);
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
