import { BasePayload } from 'payload';
import { TransactionCommand } from '@/shared/server';
import { UserRepository } from '@/entities/user';
import {
  POINT_ACTION,
  PointCalculator,
  PointHistory,
  PointHistoryRepository,
} from '@/entities/point';
import { OrderRepository } from '@/entities/order';
import { OrderProduct, OrderProductRepository } from '@/entities/order-product';
import { BankTransferTransitionOrderCommandDto } from '../../dto';
import { TransitionOrderFindOption } from '../../core';

export interface BankTransferTransitionOrderCommandDependencies {
  payload: BasePayload;
  repository: {
    user: UserRepository;
    pointHistory: PointHistoryRepository;
    order: OrderRepository;
    orderProduct: OrderProductRepository;
  };
}

export class BankTransferTransitionOrderCommand extends TransactionCommand<void> {
  private readonly repository: BankTransferTransitionOrderCommandDependencies['repository'];
  private readonly commandDto: BankTransferTransitionOrderCommandDto;
  constructor(
    dependencies: BankTransferTransitionOrderCommandDependencies,
    dto: BankTransferTransitionOrderCommandDto,
  ) {
    super(dependencies.payload);
    this.repository = dependencies.repository;
    this.commandDto = dto;
  }

  async execute(): Promise<void> {}

  protected async run() {}

  private async createEarnPointHistories(): Promise<PointHistory[]> {
    const { orderProducts: orderProductIds, user } = this.commandDto.order;
    const findOption = TransitionOrderFindOption.orderProduct.findMany(this.commandDto);
    const orderProducts = await this.repository.orderProduct.findMany(findOption);

    return await Promise.all(
      orderProducts.map(async (orderProduct) => {
        return await this.repository.pointHistory.createUsageHistory({
          user: user,
          orderProduct: orderProduct.id,
          type: POINT_ACTION.earn,
          amount: 123,
        });
      }),
    );
  }

  private async createEarnPointHistory(orderProduct: OrderProduct) {}

  private async addUserPoint(histories: PointHistory[]) {
    const user = await this.repository.user.findById(this.commandDto.order.user);
    const deltaPoint = PointCalculator.getDeltaPointByHistories(histories);
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: deltaPoint,
      action: POINT_ACTION.earn,
    });

    await this.repository.user.update({
      user: user.id,
      data: {
        point: updatedPoint,
      },
    });
  }
}
