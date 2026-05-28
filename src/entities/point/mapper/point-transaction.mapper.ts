import { PAYMENTS_METHOD, ZodSchemaParser, SchemaParserDto } from '@/shared';
import {
  CreateUsePointHistoryRequestDto,
  CreateEarnPointHistoryRequestDto,
  CreateCancelEarnPointHistoryRequestDto,
  CreateCancelUsePointHistoryRequestDto,
} from '../dto';
import { CreatePointTransactionEntity, PointItem, PointTransaction, UserReference } from '../types';
import {
  createPointTransactionEntitySchema,
  pointItemListSchema,
  pointItemSchema,
  pointTransactionSchema,
  userReferenceSchema,
} from '../schemas';
import { POINT_ACTION } from '../constants';
import { Product } from '@/entities/product/@x/point';
import { CartItem } from '@/entities/cart';

export class PointTransactionMapper {
  static responseToDomain(data: unknown): PointTransaction {
    const schemaDto: SchemaParserDto = {
      data,
      errorMsg: '포인트 적립/사용 내역을 생성하는데 문제가 발생했습니다',
    };

    return ZodSchemaParser.safeParseOrThrow(pointTransactionSchema, schemaDto);
  }

  static toUsePointHistoryEntity(
    dto: CreateUsePointHistoryRequestDto,
  ): CreatePointTransactionEntity {
    const schemaDto: SchemaParserDto = {
      data: {
        ...dto,
        type: POINT_ACTION.use,
      },
      errorMsg: '포인트 사용 내역을 생성하는데 문제가 발생했습니다',
    };

    return ZodSchemaParser.safeParseOrThrow(createPointTransactionEntitySchema, schemaDto);
  }

  static toEarnPointHistoryEntity(
    dto: CreateEarnPointHistoryRequestDto,
  ): CreatePointTransactionEntity {
    const schemaDto: SchemaParserDto = {
      data: {
        ...dto,
        type: POINT_ACTION.earn,
      },
      errorMsg: '포인트 적립 내역을 생성하는데 문제가 발생했습니다',
    };

    return ZodSchemaParser.safeParseOrThrow(createPointTransactionEntitySchema, schemaDto);
  }

  static toCancelUsePointHistoryEntity(
    dto: CreateCancelUsePointHistoryRequestDto,
    amount: number,
  ): CreatePointTransactionEntity {
    const schemaDto: SchemaParserDto = {
      data: {
        ...dto,
        amount,
        type: POINT_ACTION.cancel_use,
      },
      errorMsg: '포인트 적립취소 내역을 생성하는데 문제가 발생했습니다',
    };

    return ZodSchemaParser.safeParseOrThrow(createPointTransactionEntitySchema, schemaDto);
  }

  static toCancelEarnPointHistoryEntity(
    dto: CreateCancelEarnPointHistoryRequestDto,
    amount: number,
  ): CreatePointTransactionEntity {
    const schemaDto: SchemaParserDto = {
      data: {
        ...dto,
        amount,
        type: POINT_ACTION.cancel_earn,
      },
      errorMsg: '포인트 적립취소 내역을 생성하는데 문제가 발생했습니다',
    };

    return ZodSchemaParser.safeParseOrThrow(createPointTransactionEntitySchema, schemaDto);
  }

  // todo :: will move to user entity
  static toUserReference(data: unknown): UserReference {
    const schemaDto: SchemaParserDto = {
      data,
      errorMsg: '유저정보를 불러오는데 문제가 발생했습니다.',
    };

    return ZodSchemaParser.safeParseOrThrow(userReferenceSchema, schemaDto);
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
      errorMsg: '상품을 적립포인트 아이템으로 바꾸는 과정에서 문제가 발생했습니다',
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
      errorMsg: '장바구니 리스트를 적립포인트 아이템으로 바꾸는 과정에서 문제가 발생했습니다',
    };

    return ZodSchemaParser.safeParseOrThrow(pointItemListSchema, schemaDto);
  }
}
