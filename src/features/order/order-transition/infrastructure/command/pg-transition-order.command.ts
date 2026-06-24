import { BasePayload } from 'payload';
import { BaseError } from '@/shared';
import { TransactionCommand } from '@/shared/server';
import { OrderRepository } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { PGTransitionOrderCommandDto } from '../../dto';
import { TransitionOrderFindOption, TransitionOrderCommandResult } from '../../core';

export interface PGTransitionOrderCommandDependencies {
  payload: BasePayload;
  repository: {
    order: OrderRepository;
    orderProduct: OrderProductRepository;
  };
}

export class PGTransitionOrderCommand extends TransactionCommand<TransitionOrderCommandResult> {
  private readonly repository: PGTransitionOrderCommandDependencies['repository'];
  private readonly commandDto: PGTransitionOrderCommandDto;
  constructor(
    dependencies: PGTransitionOrderCommandDependencies,
    dto: PGTransitionOrderCommandDto,
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
}
