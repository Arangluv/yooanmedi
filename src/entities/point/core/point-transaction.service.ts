import { BaseError, Logger } from '@/shared';
import { PointTransactionRepository } from './point-transaction.repository';
import { PointTransaction } from '../types';
import { CreateUsePointHistoryRequestDto } from '../dto';
import { PointTransactionError } from '../libs';

export interface IPointTransactionService {
  createHistory: (dto: CreateUsePointHistoryRequestDto) => Promise<PointTransaction>;
  updateUserPoint: (userId: number, history: PointTransaction[]) => Promise<void>;
}

export abstract class BasePointTransaction implements IPointTransactionService {
  protected readonly pointTransactionRepository: PointTransactionRepository;

  constructor(repository: PointTransactionRepository) {
    this.pointTransactionRepository = repository;
  }

  public abstract createHistory(dto: CreateUsePointHistoryRequestDto): Promise<PointTransaction>;

  protected abstract calculateUpdatedPoint(current: number, delta: number): number;

  public async updateUserPoint(userId: number, histories: PointTransaction[]): Promise<void> {
    try {
      const user = await this.pointTransactionRepository.getUser(userId);
      const delta = histories.reduce((sum, h) => sum + h.amount, 0);
      const updated = this.calculateUpdatedPoint(user.point, delta);

      if (updated < 0) {
        throw PointTransactionError.invalidUpdatePoint(updated);
      }

      await this.pointTransactionRepository.updateUserPoint({ userId, amount: updated });
    } catch (error) {
      Logger.error(error);
      if (error instanceof BaseError) {
        throw error;
      }
      throw PointTransactionError.updateUserPointFailed();
    }
  }
}
