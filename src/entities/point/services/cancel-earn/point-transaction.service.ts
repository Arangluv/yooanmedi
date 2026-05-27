import { BasePointTransaction } from '../../core';
import { CreateCancelEarnPointHistoryRequestDto, PointTransactionDtoValidator } from '../../dto';
import { PointTransaction } from '../../types';
import { PointTransactionMapper } from '../../mapper';
import { PointTransactionFindOption } from '../../lib';

export class CancelEarnPointTransactionService extends BasePointTransaction {
  public async createHistory(
    dto: CreateCancelEarnPointHistoryRequestDto,
  ): Promise<PointTransaction> {
    try {
      PointTransactionDtoValidator.validateCreateCancelEarn(dto);

      const option = PointTransactionFindOption.orderProduct.cancel_earn(dto);
      const rollbackTarget = await this.pointTransactionRepository.findOne(option);

      const entity = PointTransactionMapper.toCancelEarnPointHistoryEntity(
        dto,
        rollbackTarget.amount,
      );
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      throw error;
    }
  }
}
