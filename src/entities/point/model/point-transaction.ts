import { zodSafeParse } from '@/shared/lib/zod';
import { IPointTransaction } from './interfaces';
import { PointTransactionRepository } from './repository';
import {
  type UsePointHistoryDto,
  type UsePointHistoryEntity,
  usePointHistoryEntitySchema,
  type CancelUsePointHistoryDto,
  type EarnPointHistoryDto,
  type CancelEarnPointHistoryDto,
  EarnPointHistoryEntity,
  earnPointHistoryEntitySchema,
} from './schema/history.schema';

abstract class PointTransaction {
  protected historyIds: number[];

  constructor() {
    this.historyIds = [];
  }

  public abstract updateUserPoint(userId: number, amount: number): Promise<void>;

  protected async addHistory(id: number): Promise<void> {
    this.historyIds.push(id);
  }
}

export class UsePointTransaction
  extends PointTransaction
  implements IPointTransaction<UsePointHistoryDto>
{
  public async createHistory(dto: UsePointHistoryDto): Promise<void> {
    const history = this.createHistoryEntity(dto);
    const result = await PointTransactionRepository.save(history);
    this.addHistory(result.id);
  }

  public async updateUserPoint(userId: number, amount: number): Promise<void> {
    const histories = await PointTransactionRepository.getHistories(this.historyIds);
    // todo :: 사용된 포인트 계산
    // const usedPoint = histories.reduce((acc, history) => acc + history.amount, 0);
    // if (usedPoint !== amount) {
    //   throw new Error('사용된 포인트와 실제 사용된 포인트가 다릅니다');
    // }

    // await PointTransactionRepository.decreaseUserPoint(userId, amount);
  }

  private createHistoryEntity(dto: UsePointHistoryDto): UsePointHistoryEntity {
    return zodSafeParse(usePointHistoryEntitySchema, dto);
  }
}

export class CancelUsePointTransaction
  extends PointTransaction
  implements IPointTransaction<CancelUsePointHistoryDto>
{
  createHistory(dto: CancelUsePointHistoryDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async updateUserPoint(userId: number, amount: number): Promise<void> {}
}

export class EarnPointTransaction
  extends PointTransaction
  implements IPointTransaction<EarnPointHistoryDto>
{
  public async createHistory(dto: EarnPointHistoryDto): Promise<void> {
    const history = this.createEntity(dto);
    const result = await PointTransactionRepository.save(history);
    this.addHistory(result.id);
  }

  private createEntity(dto: EarnPointHistoryDto): EarnPointHistoryEntity {
    return zodSafeParse(earnPointHistoryEntitySchema, dto);
  }

  public async updateUserPoint(userId: number, amount: number): Promise<void> {}
}

export class CancelEarnPointTransaction
  extends PointTransaction
  implements IPointTransaction<CancelEarnPointHistoryDto>
{
  public async createHistory(dto: CancelEarnPointHistoryDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async updateUserPoint(userId: number, amount: number): Promise<void> {}
}
