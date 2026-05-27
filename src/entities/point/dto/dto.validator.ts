import {
  createUsePointHistoryRequestSchema,
  createEarnPointHistoryRequestSchema,
  createCancelUsePointHistoryRequestSchema,
  createCancelEarnPointHistoryRequestSchema,
} from '../schemas';
import {
  CreateUsePointHistoryRequestDto,
  CreateEarnPointHistoryRequestDto,
  CreateCancelUsePointHistoryRequestDto,
  CreateCancelEarnPointHistoryRequestDto,
} from '.';
import { zodSafeParse } from '@/shared';

export class PointTransactionDtoValidator {
  static validateCreateUse(dto: CreateUsePointHistoryRequestDto) {
    return zodSafeParse(createUsePointHistoryRequestSchema, dto);
  }

  static validateCreateEarn(dto: CreateEarnPointHistoryRequestDto) {
    return zodSafeParse(createEarnPointHistoryRequestSchema, dto);
  }

  static validateCreateCancelUse(dto: CreateCancelUsePointHistoryRequestDto) {
    return zodSafeParse(createCancelUsePointHistoryRequestSchema, dto);
  }

  static validateCreateCancelEarn(dto: CreateCancelEarnPointHistoryRequestDto) {
    return zodSafeParse(createCancelEarnPointHistoryRequestSchema, dto);
  }
}
