import { BasePointTransaction } from '../../core';
import { CreateEarnPointHistoryRequestDto, PointTransactionDtoValidator } from '../../dto';
import { PointTransaction } from '../../types';
import { PointTransactionMapper } from '../../mapper';

export class EarnPointTransactionService extends BasePointTransaction {
  public async createHistory(dto: CreateEarnPointHistoryRequestDto): Promise<PointTransaction> {
    try {
      PointTransactionDtoValidator.validateCreateEarn(dto);
      const entity = PointTransactionMapper.toEarnPointHistoryEntity(dto);
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      throw error;
    }
  }
}
