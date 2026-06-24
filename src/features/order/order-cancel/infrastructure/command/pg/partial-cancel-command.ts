import { TransactionCommand } from '@/shared/infrastructure';
import { Order, OrderStatus, PaymentStatus } from '@/entities/order';
import { OrderProduct, OrderProductStatus } from '@/entities/order-product';
import { PointCalculator } from '@/entities/point';
import { POINT_ACTION } from '@/entities/point';
import {
  CancelOrderFindOption,
  CancelOrderStatusResolver,
  CancelOrderCommandResult,
  CancelOrderServiceDependencies,
} from '../../../core';

export interface PGPartialCancelCommandDto {
  order: Order;
  orderProductId: number;
}

export class PGPartialCancelCommand extends TransactionCommand<CancelOrderCommandResult> {
  protected readonly repository: CancelOrderServiceDependencies['repository'];
  protected readonly commandDto: PGPartialCancelCommandDto;

  constructor(dependencies: CancelOrderServiceDependencies, commandDto: PGPartialCancelCommandDto) {
    super(dependencies.payload);
    this.repository = dependencies.repository;
    this.commandDto = commandDto;
  }

  public async run() {
    // step 1. 주문상품 상태 변경
    await this.updateOrderProduct('cancelled');

    // step 2. 사용포인트 환불 내역 생성 / 유저포인트 업데이트
    await this.rollbackUsePoint();

    // step 3. 적립포인트 롤백 내역 생성 / 유저포인트 업데이트
    await this.rollbackEarnPoint();

    // step 4. 주문상태 변경
    const { order } = this.commandDto;
    const orderProducts = await this.getOrderProducts();
    const isFullyCancelled = CancelOrderStatusResolver.isOrderProductFullyCancelled(orderProducts);
    await this.updateOrderStatus(
      isFullyCancelled
        ? { status: { order: 'cancelled', payment: 'TOTAL_CANCEL' } }
        : { status: { order: order.orderStatus, payment: 'PARTIAL_CANCEL' } },
    );

    // step 5. 결제 취소 요청
    await this.partialCancelRequestToEasypay();

    return { message: '주문이 취소처리 되었습니다' };
  }

  // 주문상품 상태 업데이트
  protected async updateOrderProduct(
    status: Extract<OrderProductStatus, 'cancel_request' | 'cancelled'>,
  ) {
    const { orderProductId } = this.commandDto;
    await this.repository.orderProduct.update({
      orderProductId: orderProductId,
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
        orderStatus: status.order,
        paymentStatus: status.payment,
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

  // 사용 포인트 환불
  protected async rollbackUsePoint() {
    const { order, orderProductId } = this.commandDto;
    const user = await this.repository.user.findById(order.user);
    const history = await this.repository.pointHistory.createRollbackHistory({
      user: order.user,
      orderProduct: orderProductId,
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

  // 적립 포인트 회수
  protected async rollbackEarnPoint() {
    const { order, orderProductId } = this.commandDto;
    const user = await this.repository.user.findById(order.user);
    const history = await this.repository.pointHistory.createRollbackHistory({
      user: order.user,
      orderProduct: orderProductId,
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

  private async partialCancelRequestToEasypay() {
    const { order, orderProductId } = this.commandDto;
    const orderProduct = await this.repository.orderProduct.findById(orderProductId);
    const { pgCno } = await this.repository.paymentHistory.findByOrderId(order.id);

    await this.repository.easyPay.partialCancel({
      amount: orderProduct.totalAmount,
      pgCno,
    });
  }
}
