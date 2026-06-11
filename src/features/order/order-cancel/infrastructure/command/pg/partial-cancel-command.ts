import { runWithTransaction } from '@/shared/infrastructure';
import { Order, ORDER_STATUS, OrderRepository, UpdateOrderRequestDto } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import { OrderProductRepository } from '@/entities/order-product';
import {
  OrderProductApiRepository,
  OrderProductAdapter,
} from '@/entities/order-product/infrastructure';
import { ORDER_PRODUCT_STATUS, OrderProductFindOption } from '@/entities/order-product';
import { PointCalculator, PointHistoryRepository } from '@/entities/point';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserRepository } from '@/entities/user';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { EasyPayService, IEasyPay } from '@/entities/easypay';
import {
  PaymentHistoryApiRepository,
  PaymentHistoryAdapter,
} from '@/entities/payment/infrastructure';
import { isFullyCancelled } from '../../../lib/status-helper';
import { type IPartialCancelCommand } from '../../../core';
import { POINT_ACTION } from '@/entities/point';

export class PGPartialCancelCommand implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;
  private readonly orderRepository: OrderRepository;
  private readonly orderProductRepository: OrderProductRepository;
  private readonly easypayService: IEasyPay;
  private readonly pointHistoryRepository: PointHistoryRepository;
  private readonly userRepository: UserRepository;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderRepository = new OrderApiRepository(OrderAdapter());
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    this.easypayService = new EasyPayService();
    this.pointHistoryRepository = new PointHistoryApiRepository(PointHistoryAdapter());
    this.userRepository = new UserApiRepository(UserAdapter());
  }

  public async run() {
    // [step] 주문상품 상태 바꾸기 (주문취소)
    await this.updateOrderProductToCancelled();

    // [step] 사용포인트 환불
    await this.rollbackUsePoint();
    // [step] 적립 포인트 롤백
    await this.rollbackEarnPoint();

    // [step] 주문상태 바꾸기
    await this.updateOrderStatus();

    // [step] 결제 취소 요청하기
    await this.partialCancelRequestToEasypay();
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  private async updateOrderProductToCancelled() {
    await this.orderProductRepository.update({
      orderProductId: this.targetOrderProductId,
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
      },
    });
  }

  private async updateOrderStatus() {
    const orderOnGoingStatus = await this.getOrderOnGoingStatus();
    const dto = {
      order: this.order.id,
      data: {
        orderStatus: orderOnGoingStatus,
      },
    } as UpdateOrderRequestDto;
    await this.orderRepository.update(dto);
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductRepository.findMany(option);
    const orderProductStatuses = orderProducts.map(
      (orderProduct) => orderProduct.orderProductStatus,
    );

    if (isFullyCancelled(orderProductStatuses)) {
      return ORDER_STATUS.cancelled;
    }

    return this.order.orderStatus;
  }

  private async rollbackEarnPoint() {
    const user = await this.userRepository.findById(this.order.user);
    const history = await this.pointHistoryRepository.createRollbackHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
      type: POINT_ACTION.cancel_earn,
    });
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistory(history),
      action: POINT_ACTION.cancel_earn,
    });

    await this.userRepository.update({
      user: this.order.user,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async rollbackUsePoint() {
    const user = await this.userRepository.findById(this.order.user);
    const history = await this.pointHistoryRepository.createRollbackHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
      type: POINT_ACTION.cancel_earn,
    });
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistory(history),
      action: POINT_ACTION.cancel_earn,
    });

    await this.userRepository.update({
      user: this.order.user,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async partialCancelRequestToEasypay() {
    const paymentHistoryRepository = new PaymentHistoryApiRepository(PaymentHistoryAdapter());
    const orderProduct = await this.orderProductRepository.findById(this.targetOrderProductId);
    const paymentHistory = await paymentHistoryRepository.findByOrderId(this.order.id);

    await this.easypayService.partialCancelRequest({
      amount: orderProduct.totalAmount,
      pgCno: paymentHistory.pgCno,
    });
  }
}
