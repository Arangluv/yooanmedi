import { ZodSchemaParser, SchemaParserDto, PAYMENTS_METHOD } from '@/shared';
import {
  createPointTransactionSchema,
  CreatePointHistoryRequestDto,
  pointItemSchema,
  pointItemListSchema,
  PointItem,
} from '@/entities/point';
import { UpdateUserDto, updateUserSchema } from '@/entities/user';
import { Product } from '@/entities/product';
import { CartItem } from '@/entities/cart-item';
import {
  CreatePointRefundHistoryRequestDto,
  CreatePointUsageHistoryRequestDto,
  UpdateUserPointRequestDto,
} from '../dto';
import { POINT_FEATURE_ERROR_MESSAGE } from '../libs';

export class PointFeatureMapper {
  static refundReqtoDomainRequestDto(
    dto: CreatePointRefundHistoryRequestDto,
    amount: number,
  ): CreatePointHistoryRequestDto {
    const schemaDto = {
      data: {
        user: dto.user,
        orderProduct: dto.orderProduct,
        type: dto.type,
        amount,
      },
      errorMsg: POINT_FEATURE_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(createPointTransactionSchema, schemaDto);
  }

  static useageReqtoDomain(dto: CreatePointUsageHistoryRequestDto): CreatePointHistoryRequestDto {
    const schemaDto = {
      data: dto,
      errorMsg: POINT_FEATURE_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(createPointTransactionSchema, schemaDto);
  }

  static toUserUpdateDto(dto: UpdateUserPointRequestDto & { amount: number }): UpdateUserDto {
    const schemaDto = {
      data: {
        user: dto.user,
        data: {
          point: dto.amount,
        },
      },
      errorMsg: POINT_FEATURE_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(updateUserSchema, schemaDto);
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
      errorMsg: POINT_FEATURE_ERROR_MESSAGE.invalidData,
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
      errorMsg: POINT_FEATURE_ERROR_MESSAGE.invalidData,
    };

    return ZodSchemaParser.safeParseOrThrow(pointItemListSchema, schemaDto);
  }
}
