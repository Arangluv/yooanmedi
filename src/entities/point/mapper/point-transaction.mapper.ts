import { zodSafeParse } from '@/shared';
import {
  CreateUsePointHistoryRequestDto,
  CreateEarnPointHistoryRequestDto,
  CreateCancelEarnPointHistoryRequestDto,
  CreateCancelUsePointHistoryRequestDto,
} from '../dto';
import { PointHistoryEntity, PointTransaction, UserReference } from '../types';
import {
  createPointHistoryEntitySchema,
  pointTransactionSchema,
  userReferenceSchema,
} from '../schemas';
import { POINT_ACTION } from '../constants';

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
}
