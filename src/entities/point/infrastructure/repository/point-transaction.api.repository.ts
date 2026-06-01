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
    if (!result.ok) {
      throw result.error;
    }
    return PointTransactionMapper.responseToDomain(result.data);
  }

  public async findOne(option: FindOption) {
    const result = await this.adapter.findOne(option);
    if (!result.ok) {
      throw result.error;
    }
    return PointTransactionMapper.responseToDomain(result.data);
  }
}
