import { BaseError, LoggerV2 } from '@/shared';
import { User, UserRepository } from '@/entities/user/@x/point';
import { PointTransactionRepository } from './point-transaction.repository';
import { PointTransaction } from '../types';
import { PointTransactionError } from '../libs';

export interface IPointTransactionService {
  createHistory: (dto: any) => Promise<PointTransaction>;
  updateUserPointFromHistories: (userId: number, history: PointTransaction[]) => Promise<User>;
}

export abstract class BasePointTransaction implements IPointTransactionService {
  protected readonly pointTransactionRepository: PointTransactionRepository;
  protected readonly userRepository: UserRepository;

  constructor(
    pointTransactionRepository: PointTransactionRepository,
    userRepository: UserRepository,
  ) {
    this.pointTransactionRepository = pointTransactionRepository;
    this.userRepository = userRepository;
  }

  public abstract createHistory(dto: any): Promise<PointTransaction>;

  protected abstract calculateUpdatedPoint(current: number, delta: number): number;

  public async updateUserPointFromHistories(userId: number, histories: PointTransaction[]) {
    try {
      const user = await this.userRepository.findById(userId);
      const delta = histories.reduce((sum, h) => sum + h.amount, 0);
      const updatePoints = this.calculateUpdatedPoint(user.point, delta);

      if (updatePoints < 0) {
        throw PointTransactionError.invalidUpdatePoint(updatePoints);
      }

      return await this.userRepository.update({
        user: user.id,
        data: { point: updatePoints },
      });
    } catch (error) {
      LoggerV2.error(error);
      if (error instanceof BaseError) {
        throw error;
      }
      throw PointTransactionError.updateUserPointFailed();
    }
  }
}
