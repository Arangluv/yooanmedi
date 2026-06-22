import { BasePayload } from 'payload';
import { TransactionCommand } from '@/shared/infrastructure';
import { Order, OrderRepository, OrderStatus, PaymentStatus } from '@/entities/order';
import { OrderProductRepository, OrderProductStatus } from '@/entities/order-product';
import { OrderProduct } from '@/entities/order-product';
import { PointCalculator, PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { POINT_ACTION } from '@/entities/point';
import { CancelOrderFindOption } from '../../../core';

export interface BankTransferTotalCancelCommandDependencies {
  payload: BasePayload;
  repository: {
    order: OrderRepository;
    orderProduct: OrderProductRepository;
    pointHistory: PointHistoryRepository;
    user: UserRepository;
  };
}

export interface BankTransferTotalCancelCommandDto {
  order: Order;
}

export class BankTransferTotalCancelCommand extends TransactionCommand<void> {
  protected readonly repository: BankTransferTotalCancelCommandDependencies['repository'];
  protected readonly commandDto: BankTransferTotalCancelCommandDto;

  constructor(
    dependencies: BankTransferTotalCancelCommandDependencies,
    commandDto: BankTransferTotalCancelCommandDto,
  ) {
    super(dependencies.payload);
    this.repository = dependencies.repository;
    this.commandDto = commandDto;
  }

  protected async run() {
    const orderProducts = await this.getOrderProducts();

    await Promise.all(
      orderProducts.map(async (orderProduct) => {
        await this.updateOrderProduct(orderProduct, 'cancelled');
        await this.rollbackEarnPoint(orderProduct);
        await this.rollbackUsePoint(orderProduct);
      }),
    );

    await this.updateOrderStatus({
      status: {
        order: 'cancelled',
        payment: 'TOTAL_CANCEL',
      },
    });
  }

  // 사용 포인트 환불
  protected async rollbackUsePoint(orderProduct: OrderProduct) {
    const isAlreayRollback = orderProduct.orderProductStatus === 'cancelled';

    if (!isAlreayRollback) {
      const { order } = this.commandDto;
      const user = await this.repository.user.findById(order.user);
      const history = await this.repository.pointHistory.createRollbackHistory({
        user: order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_use,
      });
      const updatedPoint = PointCalculator.getUpdatePoint({
        current: user.point,
        delta: PointCalculator.getDeltaPointByHistory(history),
        action: POINT_ACTION.cancel_use,
      });

      await this.repository.user.update({
        user: order.user,
        data: {
          point: updatedPoint,
        },
      });
    }
  }

  // 적립 포인트 회수
  protected async rollbackEarnPoint(orderProduct: OrderProduct) {
    const canRollback = orderProduct.orderProductStatus !== 'pending';
    const isAlreayRollback = orderProduct.orderProductStatus === 'cancelled';

    if (canRollback && !isAlreayRollback) {
      const { order } = this.commandDto;
      const user = await this.repository.user.findById(order.user);
      const history = await this.repository.pointHistory.createRollbackHistory({
        user: order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_earn,
      });
      const updatedPoint = PointCalculator.getUpdatePoint({
        current: user.point,
        delta: PointCalculator.getDeltaPointByHistory(history),
        action: POINT_ACTION.cancel_earn,
      });

      await this.repository.user.update({
        user: order.user,
        data: {
          point: updatedPoint,
        },
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
