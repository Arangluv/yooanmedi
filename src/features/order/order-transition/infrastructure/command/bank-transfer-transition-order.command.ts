import { BasePayload } from 'payload';
import { BaseError } from '@/shared';
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
import { TransitionOrderFindOption, TransitionOrderCommandResult } from '../../core';
import { TransitionOrderMapper } from '../../mapper';

export interface BankTransferTransitionOrderCommandDependencies {
  payload: BasePayload;
  repository: {
    user: UserRepository;
    pointHistory: PointHistoryRepository;
    order: OrderRepository;
    orderProduct: OrderProductRepository;
  };
}

export class BankTransferTransitionOrderCommand extends TransactionCommand<TransitionOrderCommandResult> {
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

  protected async run() {
    try {
      // step 1. update order status
      await this.repository.order.update({
        order: this.commandDto.order.id,
        data: {
          orderStatus: this.commandDto.orderStatus.to,
          paymentStatus: this.commandDto.paymentStatus.to,
        },
      });

      // step 2. find filterd orderProduct - 현재상태(from state)인 orderProduct를 찾는다.
      const findOption = TransitionOrderFindOption.orderProduct.findMany(this.commandDto);
      const orderProducts = await this.repository.orderProduct.findMany(findOption);

      // step 3. update orderProduct status
      await this.repository.orderProduct.updateMany({
        orderProductIds: orderProducts.map((item) => item.id),
        data: {
          orderProductStatus: this.commandDto.orderProductStatus.to,
        },
      });

      // step 4. optional - 입금대기중인 상태인 경우
      if (this.commandDto.orderStatus.from === 'pending') {
        // step 4-1. create earn point history
        const histories = await this.createEarnPointHistories(orderProducts);

        // step 4-2. update user point
        await this.addUserPoint(histories);
      }

      return { message: this.commandDto.messages.success };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new BaseError({
        clientMsg: this.commandDto.messages.error,
        errorName: 'PGTransitionOrderCommandError',
      });
    }
  }

  private async createEarnPointHistories(orderProducts: OrderProduct[]): Promise<PointHistory[]> {
    const { user } = this.commandDto.order;

    return await Promise.all(
      orderProducts.map(async (orderProduct) => {
        const pointItem = TransitionOrderMapper.orderProductToPointItem(orderProduct);
        const earnedPoint = PointCalculator.forBank(pointItem);
        return await this.repository.pointHistory.createUsageHistory({
          user: user,
          orderProduct: orderProduct.id,
          type: POINT_ACTION.earn,
          amount: earnedPoint,
        });
      }),
    );
  }

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
