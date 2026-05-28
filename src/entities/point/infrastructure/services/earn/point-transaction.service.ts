import { BaseError, Logger } from '@/shared';
import { BasePointTransaction } from '../../../core';
import { CreateEarnPointHistoryRequestDto } from '../../../dto';
import { PointTransaction } from '../../../types';
import { PointTransactionMapper } from '../../../mapper';
import { PointCalculator, PointTransactionError } from '../../../libs';

export class EarnPointTransactionService extends BasePointTransaction {
  public async createHistory(dto: CreateEarnPointHistoryRequestDto): Promise<PointTransaction> {
    try {
      const entity = PointTransactionMapper.toEarnPointHistoryEntity(dto);
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      Logger.error(error);
      if (error instanceof BaseError) {
        throw error;
      }
      throw PointTransactionError.createHistoryFailed();
    }
  }

  protected calculateUpdatedPoint(current: number, delta: number): number {
    return PointCalculator.pointEarn(current, delta);
  }
}
