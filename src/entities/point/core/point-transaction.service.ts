import { POINT_ACTION, PointAction } from '../constants';
import { PointTransaction } from '../types';
import { PointTransactionRepository } from './point-transaction.repository';
import { CreateUsePointHistoryRequestDto } from '../dto';

export interface IPointTransactionService {
  createHistory: (dto: CreateUsePointHistoryRequestDto) => Promise<PointTransaction>;
  updateUserPointBySavedHistories: (userId: number) => Promise<void>;
  addHistory: (data: PointTransaction) => Promise<void>;
}

export abstract class BasePointTransaction implements IPointTransactionService {
  protected stack: PointTransaction[];
  protected readonly pointTransactionRepository: PointTransactionRepository;
  private readonly mode: PointAction;

  constructor(repository: PointTransactionRepository, mode: PointAction) {
    this.stack = [];
    this.pointTransactionRepository = repository;
    this.mode = mode;
  }

  public abstract createHistory(dto: CreateUsePointHistoryRequestDto): Promise<PointTransaction>;

  public async addHistory(data: PointTransaction): Promise<void> {
    this.stack.push(data);
  }

  public async updateUserPointBySavedHistories(userId: number): Promise<void> {
    try {
      const user = await this.pointTransactionRepository.getUser(userId);
      const amount = this.getPointAmountFromStack();
      const pointCalculator = this.getUpdatePointCalculator(this.mode);

      const updatedAmount = pointCalculator({ currentPoint: user.point, deltaPoint: amount });
      if (updatedAmount < 0) {
        throw new Error('업데이트 포인트가 0보다 작을 수 없습니다.');
      }

      await this.pointTransactionRepository.updateUserPoint({ userId, amount: updatedAmount });
    } catch (error) {
      throw error;
    }
  }

  protected getPointAmountFromStack(): number {
    return this.stack.reduce((acc, history) => acc + history.amount, 0);
  }

  protected getUpdatePointCalculator(mode: PointAction) {
    const adder = ({ currentPoint, deltaPoint }: { currentPoint: number; deltaPoint: number }) => {
      return currentPoint + deltaPoint;
    };

    const subtractor = ({
      currentPoint,
      deltaPoint,
    }: {
      currentPoint: number;
      deltaPoint: number;
    }) => {
      return currentPoint - deltaPoint;
    };

    switch (mode) {
      case POINT_ACTION.use:
        return subtractor;
      case POINT_ACTION.earn:
        return adder;
      case POINT_ACTION.cancel_earn:
        return subtractor;
      case POINT_ACTION.cancel_use:
        return adder;
    }
  }
}
