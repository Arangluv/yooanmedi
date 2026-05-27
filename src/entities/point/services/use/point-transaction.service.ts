import { BasePointTransaction } from '../../core';
import { CreateUsePointHistoryRequestDto, PointTransactionDtoValidator } from '../../dto';
import { PointTransaction } from '../../types';
import { PointTransactionMapper } from '../../mapper';

export class UsePointTransactionService extends BasePointTransaction {
  public async createHistory(dto: CreateUsePointHistoryRequestDto): Promise<PointTransaction> {
    try {
      PointTransactionDtoValidator.validateCreateUse(dto);
      const entity = PointTransactionMapper.toUsePointHistoryEntity(dto);
      return await this.pointTransactionRepository.create(entity);
    } catch (error) {
      throw error;
    }
  }
}
