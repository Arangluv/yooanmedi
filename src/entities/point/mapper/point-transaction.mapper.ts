import { PAYMENTS_METHOD, zodSafeParse } from '@/shared';
import {
  CreateUsePointHistoryRequestDto,
  CreateEarnPointHistoryRequestDto,
  CreateCancelEarnPointHistoryRequestDto,
  CreateCancelUsePointHistoryRequestDto,
} from '../dto';
import { PointHistoryEntity, PointItem, PointTransaction, UserReference } from '../types';
import {
  createPointHistoryEntitySchema,
  pointItemListSchema,
  pointItemSchema,
  pointTransactionSchema,
  userReferenceSchema,
} from '../schemas';
import { POINT_ACTION } from '../constants';
import { Product } from '@/entities/product/@x/point';
import { CartItem } from '@/entities/cart';

export class PointTransactionMapper {
  static toDomain(data: unknown): PointTransaction {
    return zodSafeParse(pointTransactionSchema, data);
  }

  static toUsePointHistoryEntity(dto: CreateUsePointHistoryRequestDto): PointHistoryEntity {
    return zodSafeParse(createPointHistoryEntitySchema, { ...dto, type: POINT_ACTION.use });
  }

  static toEarnPointHistoryEntity(dto: CreateEarnPointHistoryRequestDto): PointHistoryEntity {
    return zodSafeParse(createPointHistoryEntitySchema, { ...dto, type: POINT_ACTION.earn });
  }

  static toCancelUsePointHistoryEntity(
    dto: CreateCancelUsePointHistoryRequestDto,
    amount: number,
  ): PointHistoryEntity {
    return zodSafeParse(createPointHistoryEntitySchema, {
      ...dto,
      amount,
      type: POINT_ACTION.cancel_use,
    });
  }

  static toCancelEarnPointHistoryEntity(
    dto: CreateCancelEarnPointHistoryRequestDto,
    amount: number,
  ): PointHistoryEntity {
    return zodSafeParse(createPointHistoryEntitySchema, {
      ...dto,
      amount,
      type: POINT_ACTION.cancel_earn,
    });
  }

  static toUserReference(data: unknown): UserReference {
    return zodSafeParse(userReferenceSchema, data);
  }

  static productToPointItem(product: Product, quantity: number): PointItem {
    return zodSafeParse(pointItemSchema, {
      rates: {
        [PAYMENTS_METHOD.bank_transfer]: product.cashback_rate_for_bank,
        [PAYMENTS_METHOD.credit_card]: product.cashback_rate,
      },
      price: product.price,
      quantity,
    });
  }

  static cartItemListToPointItemList(cartItemList: CartItem[]): PointItem[] {
    const dto = cartItemList.map((item) => {
      return {
        rates: {
          [PAYMENTS_METHOD.bank_transfer]: item.product.cashback_rate_for_bank,
          [PAYMENTS_METHOD.credit_card]: item.product.cashback_rate,
        },
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    return zodSafeParse(pointItemListSchema, dto);
  }
}
