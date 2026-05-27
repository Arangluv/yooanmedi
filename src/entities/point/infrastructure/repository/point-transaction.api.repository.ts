import { FindOption } from '@/shared';
import { PointTransactionAdapter } from '../api/point-transaction.adapter';
import { PointHistoryEntity } from '../../types';
import { PointTransactionRepository } from '../../core';
import { PointTransactionMapper } from '../../mapper';

export class PointTransactionApiRepository implements PointTransactionRepository {
  private adapter: ReturnType<typeof PointTransactionAdapter>;

  constructor() {
    this.adapter = PointTransactionAdapter();
  }

  public async create(entity: PointHistoryEntity) {
    const result = await this.adapter.create(entity);
    return PointTransactionMapper.toDomain(result);
  }

  public async findOne(option: FindOption) {
    const result = await this.adapter.findOne(option);
    return PointTransactionMapper.toDomain(result);
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
