import { BasePayload } from 'payload';
import { TransactionCommand } from '@/shared/server';
import { Order, OrderStatus, PaymentStatus } from '@/entities/order';
import { OrderProduct, OrderProductStatus } from '@/entities/order-product';
import { OrderRepository } from '@/entities/order';
import { PointCalculator, PointHistoryRepository } from '@/entities/point';
import { OrderProductRepository } from '@/entities/order-product';
import { POINT_ACTION } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { CancelOrderFindOption, CancelOrderStatusResolver } from '../../../core';

export interface BankTransferPartialCancelCommandDependencies {
  payload: BasePayload;
  repository: {
    order: OrderRepository;
    orderProduct: OrderProductRepository;
    pointHistory: PointHistoryRepository;
    user: UserRepository;
  };
}

export interface BankTransferPartialCancelCommandDto {
  order: Order;
  orderProductId: number;
}

export abstract class BankTransferPartialCancelCommand extends TransactionCommand<void> {
  protected readonly repository: BankTransferPartialCancelCommandDependencies['repository'];
  protected readonly commandDto: BankTransferPartialCancelCommandDto;

  constructor(
    dependencies: BankTransferPartialCancelCommandDependencies,
    commandDto: BankTransferPartialCancelCommandDto,
  ) {
    super(dependencies.payload);
    this.repository = dependencies.repository;
    this.commandDto = commandDto;
  }

  protected abstract run(): Promise<any>;

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

  // 전체 주문상품 불러오기
  protected async getOrderProducts(): Promise<OrderProduct[]> {
    const { order } = this.commandDto;
    const option = CancelOrderFindOption.orderProduct.findMany(order.id);
    const orderProducts = await this.repository.orderProduct.findMany(option);
    return orderProducts;
  }
}

/** 입금 확인중 상태에서 사용되는 부분취소 커맨드 - 즉시 주문취소시킨다 */
export class BankTransferPartialCancelCommandForImmediate extends BankTransferPartialCancelCommand {
  constructor(
    dependencies: BankTransferPartialCancelCommandDependencies,
    commandDto: BankTransferPartialCancelCommandDto,
  ) {
    super(dependencies, commandDto);
  }

  protected async run() {
    // step 1. 주문 취소상태로 업데이트
    await this.updateOrderProduct('cancelled');

    // step 2. 사용포인트 환불 내역 생성 / 유저 포인트 환불
    await this.rollbackUsePoint();

    // step 3. 주문 상태 업데이트
    const { order } = this.commandDto;
    const orderProducts = await this.getOrderProducts();
    const isFullyCancelled = CancelOrderStatusResolver.isOrderProductFullyCancelled(orderProducts);
    await this.updateOrderStatus(
      isFullyCancelled
        ? { status: { order: 'cancelled', payment: 'TOTAL_CANCEL' } }
        : { status: { order: order.orderStatus, payment: 'PARTIAL_CANCEL' } },
    );
  }
}

/** 결제가 완료된 상태에서 사용되는 부분취소 커맨드 */
export class BankTransferPartialCancelCommandForPaied extends BankTransferPartialCancelCommand {
  constructor(
    dependencies: BankTransferPartialCancelCommandDependencies,
    commandDto: BankTransferPartialCancelCommandDto,
  ) {
    super(dependencies, commandDto);
  }

  protected async run() {
    // step 1. 주문 취소상태로 업데이트
    await this.updateOrderProduct('cancelled');

    // step 2. 사용포인트 환불 내역 생성 / 유저 포인트 환불
    await this.rollbackUsePoint();

    // step 3. 적립포인트 환수 내역 생성 / 유저 포인트 환수처리
    await this.rollbackEarnPoint();

    // step 4. 주문 상태 업데이트
    const { order } = this.commandDto;
    const orderProducts = await this.getOrderProducts();

    if (CancelOrderStatusResolver.isOrderProductFullyCancelled(orderProducts)) {
      await this.updateOrderStatus({ status: { order: 'cancelled', payment: 'TOTAL_CANCEL' } });
      return;
    }

    if (CancelOrderStatusResolver.hasCancelRequestInOrderProducts(orderProducts)) {
      await this.updateOrderStatus({
        status: { order: 'cancel_request', payment: 'PARTIAL_CANCEL' },
      });
      return;
    }

    await this.updateOrderStatus({
      status: { order: order.orderStatus, payment: 'PARTIAL_CANCEL' },
    });
  }
}

/** 결제취소 요청을 보내는 부분취소 커맨드 */
export class BankTransferPartialCancelCommandForRequest extends BankTransferPartialCancelCommand {
  constructor(
    dependencies: BankTransferPartialCancelCommandDependencies,
    commandDto: BankTransferPartialCancelCommandDto,
  ) {
    super(dependencies, commandDto);
  }

  protected async run() {
    // step 1. 주문 취소상태로 업데이트
    await this.updateOrderProduct('cancel_request');

    // step 2. 적립포인트 환수 내역 생성 / 유저 포인트 환수처리
    await this.rollbackUsePoint();

    // step 4. 주문 상태 업데이트
    await this.updateOrderStatus({
      status: { order: 'cancel_request', payment: 'PARTIAL_CANCEL' },
    });
  }
}
