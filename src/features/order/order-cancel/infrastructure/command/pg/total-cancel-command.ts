import { TransactionCommand } from '@/shared/server';
import { Order, OrderStatus, PaymentStatus } from '@/entities/order';
import { OrderProductStatus } from '@/entities/order-product';
import { ORDER_PRODUCT_STATUS, OrderProduct } from '@/entities/order-product';
import { PointCalculator } from '@/entities/point';
import { POINT_ACTION } from '@/entities/point';
import {
  CancelOrderFindOption,
  CancelOrderStatusResolver,
  CancelOrderCommandResult,
  CancelOrderServiceDependencies,
} from '../../../core';

type CancelStrategy = 'partial' | 'total';

interface CancelPlan {
  strategy: CancelStrategy;
  amount: number;
}

export interface PGTotalCancelCommandDto {
  order: Order;
}

export class PGTotalCancelCommand extends TransactionCommand<CancelOrderCommandResult> {
  protected readonly repository: CancelOrderServiceDependencies['repository'];
  protected readonly commandDto: PGTotalCancelCommandDto;

  constructor(dependencies: CancelOrderServiceDependencies, commandDto: PGTotalCancelCommandDto) {
    super(dependencies.payload);
    this.repository = dependencies.repository;
    this.commandDto = commandDto;
  }

  public async run() {
    const orderProducts = await this.getOrderProducts();
    const cancelPlan = this.resolveCancelPlan(orderProducts);

    const results = await Promise.all(
      orderProducts.map(async (orderProduct) => {
        await this.updateOrderProduct(orderProduct, 'cancelled');
        const rollbackEarnPointHistory = await this.createRollbackEarnPointHistory(orderProduct);
        const rollbackUsePointHistory = await this.createRollbackUsePointHistory(orderProduct);

        return { rollbackEarnPointHistory, rollbackUsePointHistory };
      }),
    );

    // 유저 포인트 업데이트
    const { order } = this.commandDto;
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

    // 주문 상태 업데이트
    await this.updateOrderStatus({
      status: {
        order: 'cancelled',
        payment: 'TOTAL_CANCEL',
      },
    });

    // EasyPay는 결제취소에 0원이 들어가면 에러를 반환한다 -> todo:: entity에서 처리하도록 위임
    if (cancelPlan.amount > 0) {
      await this.cancelRequestToEasypay(cancelPlan);
    }

    return { message: '주문이 취소처리 되었습니다' };
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

  private async cancelRequestToEasypay({ strategy, amount }: CancelPlan) {
    const { order } = this.commandDto;
    const paymentHistory = await this.repository.paymentHistory.findByOrderId(order.id);

    if (strategy === 'total') {
      await this.repository.easyPay.totalCancel({ amount, pgCno: paymentHistory.pgCno });
    } else {
      await this.repository.easyPay.partialCancel({ amount, pgCno: paymentHistory.pgCno });
    }
  }

  private resolveCancelPlan(orderProducts: OrderProduct[]): CancelPlan {
    let cancelAmount = 0;
    orderProducts.forEach((orderProduct) => {
      if (orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancelled) {
        cancelAmount += orderProduct.totalAmount;
      }
    });

    if (CancelOrderStatusResolver.hasOrderProductsCancelled(orderProducts)) {
      return { strategy: 'partial', amount: cancelAmount };
    } else {
      return { strategy: 'total', amount: cancelAmount };
    }
  }

  // 전체 주문상품 불러오기
  protected async getOrderProducts(): Promise<OrderProduct[]> {
    const { order } = this.commandDto;
    const option = CancelOrderFindOption.orderProduct.findMany(order.id);
    const orderProducts = await this.repository.orderProduct.findMany(option);
    return orderProducts;
  }
}
