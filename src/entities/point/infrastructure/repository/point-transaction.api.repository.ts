import { FindOption } from '@/shared';
import { PayloadCmsErrorTranslator } from '@/shared/server';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../../constants';
import { PointTransactionAdapter } from '../api/point-transaction.adapter';
import { CreatePointTransactionEntity } from '../../types';
import { PointTransactionRepository } from '../../core';
import { PointTransactionMapper } from '../../mapper';

export class PointTransactionApiRepository implements PointTransactionRepository {
  private adapter: ReturnType<typeof PointTransactionAdapter>;

  constructor(adapter: ReturnType<typeof PointTransactionAdapter>) {
    this.adapter = adapter;
  }

  public async create(entity: CreatePointTransactionEntity) {
    try {
      const result = await this.adapter.create(entity);
      return PointTransactionMapper.responseToDomain(result);
    } catch (error) {
      const clientMsg = POINT_TRANSACTION_ERROR_MESSAGE.create;
      throw PayloadCmsErrorTranslator.toBaseError(error, clientMsg);
    }
  }

  public async findOne(option: FindOption) {
    try {
      const UNIQUE_INDEX = 0;
      const result = await this.adapter.findOne(option);
      return PointTransactionMapper.responseToDomain(result[UNIQUE_INDEX]);
    } catch (error) {
      const clientMsg = POINT_TRANSACTION_ERROR_MESSAGE.findHistory;
      throw PayloadCmsErrorTranslator.toBaseError(error, clientMsg);
    }
  }

  // todo :: move to user entity
  public async updateUserPoint({ userId, amount }: { userId: number; amount: number }) {
    try {
      await this.adapter.updateUserPoint(userId, amount);
    } catch (error) {
      const clientMsg = POINT_TRANSACTION_ERROR_MESSAGE.updatePoint;
      throw PayloadCmsErrorTranslator.toBaseError(error, clientMsg);
    }
  }

  public async getUser(userId: number) {
    try {
      const result = await this.adapter.getUser(userId);
      return PointTransactionMapper.toUserReference(result);
    } catch (error) {
      const clientMsg = POINT_TRANSACTION_ERROR_MESSAGE.findUser;
      throw PayloadCmsErrorTranslator.toBaseError(error, clientMsg);
    }
  }
}
