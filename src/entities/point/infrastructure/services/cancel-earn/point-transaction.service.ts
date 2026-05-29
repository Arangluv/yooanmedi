import { BaseError } from '@/shared';
import { BasePointTransaction } from '../../../core';
import { CreateCancelEarnPointHistoryRequestDto } from '../../../dto';
import { PointTransaction } from '../../../types';
import { PointTransactionMapper } from '../../../mapper';
import { PointCalculator, PointTransactionError, PointTransactionFindOption } from '../../../libs';

export class CancelEarnPointTransactionService extends BasePointTransaction {
  public async createHistory(
    dto: CreateCancelEarnPointHistoryRequestDto,
  ): Promise<PointTransaction> {
    try {
      const option = PointTransactionFindOption.orderProduct.cancel_earn(dto);
      const rollbackTarget = await this.pointTransactionRepository.findOne(option);
      const entity = PointTransactionMapper.toCancelEarnPointHistoryEntity(
        dto,
        rollbackTarget.amount,
      );
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw PointTransactionError.createHistoryFailed();
    }
  }

  protected calculateUpdatedPoint(current: number, delta: number): number {
    return PointCalculator.cancelEarnPoint(current, delta);
  }
}
