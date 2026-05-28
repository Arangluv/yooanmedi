import { FindOption } from '@/shared';
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
    const result = await this.adapter.create(entity);
    return PointTransactionMapper.responseToDomain(result);
  }

  public async findOne(option: FindOption) {
    const UNIQUE_INDEX = 0;
    const result = await this.adapter.findOne(option);
    return PointTransactionMapper.responseToDomain(result[UNIQUE_INDEX]);
  }

  // todo :: move to user entity
  public async updateUserPoint({ userId, amount }: { userId: number; amount: number }) {
    await this.adapter.updateUserPoint(userId, amount);
  }

  public async getUser(userId: number) {
    const result = await this.adapter.getUser(userId);
    return PointTransactionMapper.toUserReference(result);
  }
}
