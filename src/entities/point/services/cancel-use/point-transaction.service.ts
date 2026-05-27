import { BasePointTransaction } from '../../core';
import { CreateCancelUsePointHistoryRequestDto, PointTransactionDtoValidator } from '../../dto';
import { PointTransaction } from '../../types';
import { PointTransactionMapper } from '../../mapper';
import { PointTransactionFindOption } from '../../lib';

export class CancelUsePointTransactionService extends BasePointTransaction {
  public async createHistory(
    dto: CreateCancelUsePointHistoryRequestDto,
  ): Promise<PointTransaction> {
    try {
      PointTransactionDtoValidator.validateCreateCancelUse(dto);

      const option = PointTransactionFindOption.orderProduct.cancel_use(dto);
      const rollbackTarget = await this.pointTransactionRepository.findOne(option);

      const entity = PointTransactionMapper.toCancelUsePointHistoryEntity(
        dto,
        rollbackTarget.amount,
      );
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      throw error;
    }
  }
}
