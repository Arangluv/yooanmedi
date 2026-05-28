import { BasePointTransaction } from '../../../core';
import { CreateCancelUsePointHistoryRequestDto } from '../../../dto';
import { PointTransaction } from '../../../types';
import { PointTransactionMapper } from '../../../mapper';
import { PointTransactionFindOption, PointCalculator, PointTransactionError } from '../../../libs';
import { BaseError, Logger } from '@/shared';

export class CancelUsePointTransactionService extends BasePointTransaction {
  public async createHistory(
    dto: CreateCancelUsePointHistoryRequestDto,
  ): Promise<PointTransaction> {
    try {
      const option = PointTransactionFindOption.orderProduct.cancel_use(dto);
      const rollbackTarget = await this.pointTransactionRepository.findOne(option);
      const entity = PointTransactionMapper.toCancelUsePointHistoryEntity(
        dto,
        rollbackTarget.amount,
      );
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
    return PointCalculator.cancelUsePoint(current, delta);
  }
}
