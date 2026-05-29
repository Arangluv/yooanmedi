import { BaseError } from '@/shared';
import { BasePointTransaction } from '../../../core';
import { CreateUsePointHistoryRequestDto } from '../../../dto';
import { PointTransaction } from '../../../types';
import { PointTransactionMapper } from '../../../mapper';
import { PointCalculator, PointTransactionError } from '../../../libs';

export class UsePointTransactionService extends BasePointTransaction {
  public async createHistory(dto: CreateUsePointHistoryRequestDto): Promise<PointTransaction> {
    try {
      const entity = PointTransactionMapper.toUsePointHistoryEntity(dto);
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw PointTransactionError.createHistoryFailed();
    }
  }

  protected calculateUpdatedPoint(current: number, delta: number): number {
    return PointCalculator.pointUse(current, delta);
  }
}
