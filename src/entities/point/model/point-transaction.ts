import { zodSafeParse, BusinessLogicError, FindOption } from '@/shared';
import { IPointTransaction } from './interfaces';
import { PointTransactionRepository } from './repository';
import {
  usePointHistoryEntitySchema,
  EarnPointHistoryEntity,
  earnPointHistoryEntitySchema,
  toCancelUsePointEntity,
  toCancelEarnPointEntity,
} from './schema/history.schema';
import type {
  UsePointHistoryDto,
  UsePointHistoryEntity,
  CancelUsePointHistoryDto,
  EarnPointHistoryDto,
  CancelEarnPointHistoryDto,
} from './schema/history.schema';
import { POINT_ACTION } from '../constants/point-action';

interface CreatedHistory {
  id: number;
  amount: number;
}

abstract class PointTransaction {
  protected histories: CreatedHistory[];

  constructor() {
    this.histories = [];
  }

  public abstract updateUserPoint(userId: number, amount: number): Promise<void>;

  protected async addHistory(history: CreatedHistory): Promise<void> {
    this.histories.push(history);
  }
}

export class UsePointTransaction
  extends PointTransaction
  implements IPointTransaction<UsePointHistoryDto>
{
  public async createHistory(dto: UsePointHistoryDto): Promise<void> {
    const history = this.createHistoryEntity(dto);
    const result = await PointTransactionRepository.save(history);
    this.addHistory(result);
  }

  public async updateUserPoint(userId: number, amount: number): Promise<void> {
    const ids = this.histories.map((item) => item.id);
    const histories = await PointTransactionRepository.getHistories(ids);
    const amountCalculatedFromHistories = histories.reduce(
      (acc, history) => acc + history.amount,
      0,
    );

    if (amountCalculatedFromHistories !== amount) {
      const error = new BusinessLogicError('주문을 처리하는데 문제가 발생했습니다');
      error.setDevMessage('사용된 포인트와 실제 사용된 포인트가 다릅니다');
      throw error;
    }

    await PointTransactionRepository.decreaseUserPoint(userId, amount);
  }

  private createHistoryEntity(dto: UsePointHistoryDto): UsePointHistoryEntity {
    return zodSafeParse(usePointHistoryEntitySchema, dto);
  }
}

export class CancelUsePointTransaction
  extends PointTransaction
  implements IPointTransaction<CancelUsePointHistoryDto>
{
  public async createHistory(dto: CancelUsePointHistoryDto): Promise<void> {
    const rollbackTargetHistory = await this.findUsePointTransaction(dto.orderProduct);

    const history = toCancelUsePointEntity({ ...dto, amount: rollbackTargetHistory.amount });
    const result = await PointTransactionRepository.save(history);
    this.addHistory(result);
  }

  public async updateUserPoint(userId: number): Promise<void> {
    const ids = this.histories.map((item) => item.id);
    const histories = await PointTransactionRepository.getHistories(ids);
    const amountCalculatedFromHistories = histories.reduce(
      (acc, history) => acc + history.amount,
      0,
    );

    await PointTransactionRepository.increaseUserPoint(userId, amountCalculatedFromHistories);
  }

  private async findUsePointTransaction(orderProductId: number) {
    const option: FindOption = {
      pagination: false,
      where: {
        orderProduct: {
          equals: orderProductId,
        },
        type: {
          equals: POINT_ACTION.USE,
        },
      },
    };
    const history = await PointTransactionRepository.findOne(option);
    return history;
  }
}

export class EarnPointTransaction
  extends PointTransaction
  implements IPointTransaction<EarnPointHistoryDto>
{
  public async createHistory(dto: EarnPointHistoryDto): Promise<void> {
    const history = this.createEntity(dto);
    const result = await PointTransactionRepository.save(history);
    this.addHistory(result);
  }

  private createEntity(dto: EarnPointHistoryDto): EarnPointHistoryEntity {
    return zodSafeParse(earnPointHistoryEntitySchema, dto);
  }

  public async updateUserPoint(userId: number, amount: number): Promise<void> {
    const ids = this.histories.map((item) => item.id);
    const histories = await PointTransactionRepository.getHistories(ids);
    const amountCalculatedFromHistories = histories.reduce(
      (acc, history) => acc + history.amount,
      0,
    );

    if (amountCalculatedFromHistories !== amount) {
      const error = new BusinessLogicError('주문을 처리하는데 문제가 발생했습니다');
      error.setDevMessage('사용된 포인트와 실제 사용된 포인트가 다릅니다');
      throw error;
    }

    await PointTransactionRepository.increaseUserPoint(userId, amount);
  }
}

export class CancelEarnPointTransaction
  extends PointTransaction
  implements IPointTransaction<CancelEarnPointHistoryDto>
{
  public async createHistory(dto: CancelEarnPointHistoryDto): Promise<void> {
    const rollbackTargetHistory = await this.findUsePointTransaction(dto.orderProduct);

    const history = toCancelEarnPointEntity({ ...dto, amount: rollbackTargetHistory.amount });
    const result = await PointTransactionRepository.save(history);
    this.addHistory(result);
  }

  public async updateUserPoint(userId: number): Promise<void> {
    const ids = this.histories.map((item) => item.id);
    const histories = await PointTransactionRepository.getHistories(ids);
    const amountCalculatedFromHistories = histories.reduce(
      (acc, history) => acc + history.amount,
      0,
    );

    await PointTransactionRepository.decreaseUserPoint(userId, amountCalculatedFromHistories);
  }

  private async findUsePointTransaction(orderProductId: number) {
    const option: FindOption = {
      pagination: false,
      where: {
        orderProduct: {
          equals: orderProductId,
        },
        type: {
          equals: POINT_ACTION.EARN,
        },
      },
    };

    const history = await PointTransactionRepository.findOne(option);
    return history;
  }
}
