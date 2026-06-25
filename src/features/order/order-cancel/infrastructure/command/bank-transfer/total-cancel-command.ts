import { TransactionCommand } from '@/shared/server';
import { Order, OrderStatus, PaymentStatus } from '@/entities/order';
import { OrderProductStatus } from '@/entities/order-product';
import { OrderProduct } from '@/entities/order-product';
import { PointCalculator } from '@/entities/point';
import { POINT_ACTION } from '@/entities/point';
import {
  CancelOrderFindOption,
  CancelOrderCommandResult,
  CancelOrderServiceDependencies,
} from '../../../core';

export interface BankTransferTotalCancelCommandDto {
  order: Order;
}

export class BankTransferTotalCancelCommand extends TransactionCommand<CancelOrderCommandResult> {
  protected readonly repository: CancelOrderServiceDependencies['repository'];
  protected readonly commandDto: BankTransferTotalCancelCommandDto;

  constructor(
    dependencies: CancelOrderServiceDependencies,
    commandDto: BankTransferTotalCancelCommandDto,
  ) {
    super(dependencies.payload);
    this.repository = dependencies.repository;
    this.commandDto = commandDto;
  }

  protected async run() {
    const { order } = this.commandDto;
    const orderProducts = await this.getOrderProducts();

    const results = await Promise.all(
      orderProducts.map(async (orderProduct) => {
        await this.updateOrderProduct(orderProduct, 'cancelled');
        const rollbackEarnPointHistory = await this.createRollbackEarnPointHistory(orderProduct);
        const rollbackUsePointHistory = await this.createRollbackUsePointHistory(orderProduct);

        return { rollbackEarnPointHistory, rollbackUsePointHistory };
      }),
    );

    // 유저 포인트 업데이트
    const user = await this.repository.user.findById(order.user);
    const histories = results.flatMap(({ rollbackEarnPointHistory, rollbackUsePointHistory }) => [
      rollbackEarnPointHistory,
      rollbackUsePointHistory,
    ]);
    const historiesRemovedUndefined = histories.filter((history) => history !== undefined);

    const rollbackUsePointHistories = historiesRemovedUndefined.filter(
      (history) => history.type === 'CANCEL_USE',
    );
    const rollbackEarnPointHistories = historiesRemovedUndefined.filter(
      (history) => history.type === 'CANCEL_EARN',
    );

    const rollbackUsePoint = PointCalculator.getDeltaPointByHistories(rollbackUsePointHistories);
    const rollbackEarnPoint = PointCalculator.getDeltaPointByHistories(rollbackEarnPointHistories);
    const updatedPoint = user.point + rollbackUsePoint - rollbackEarnPoint;
    await this.repository.user.update({
      user: order.user,
      data: {
        point: updatedPoint,
      },
    });

    await this.updateOrderStatus({
      status: {
        order: 'cancelled',
        payment: 'TOTAL_CANCEL',
      },
    });

    return { message: '주문이 취소처리 되었습니다' };
  }

  // 사용 포인트 환불
  protected async createRollbackUsePointHistory(orderProduct: OrderProduct) {
    const isAlreayRollback = orderProduct.orderProductStatus === 'cancelled';

    if (!isAlreayRollback) {
      const { order } = this.commandDto;
      return await this.repository.pointHistory.createRollbackHistory({
        user: order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_use,
      });
    }
  }

  // 적립 포인트 회수
  protected async createRollbackEarnPointHistory(orderProduct: OrderProduct) {
    const canRollback = orderProduct.orderProductStatus !== 'pending';
    const isAlreayRollback = orderProduct.orderProductStatus === 'cancelled';

    if (canRollback && !isAlreayRollback) {
      const { order } = this.commandDto;
      return await this.repository.pointHistory.createRollbackHistory({
        user: order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_earn,
      });
    }
  }

  // 주문 상태 업데이트
  protected async updateOrderStatus({
    status,
  }: {
    status: { order: OrderStatus; payment: PaymentStatus };
  }) {
    const { order } = this.commandDto;
    await this.repository.order.update({
      order: order.id,
      data: {
        paymentStatus: status.payment,
        orderStatus: status.order,
      },
    });
  }

  // 주문상품 상태 업데이트
  protected async updateOrderProduct(
    orderProduct: OrderProduct,
    status: Extract<OrderProductStatus, 'cancel_request' | 'cancelled'>,
  ) {
    await this.repository.orderProduct.update({
      orderProductId: orderProduct.id,
      data: {
        orderProductStatus: status,
      },
    });
  }

  // 전체 주문상품 불러오기
  protected async getOrderProducts(): Promise<OrderProduct[]> {
    const { order } = this.commandDto;
    const option = CancelOrderFindOption.orderProduct.findMany(order.id);
    const orderProducts = await this.repository.orderProduct.findMany(option);
    return orderProducts;
  }
}
