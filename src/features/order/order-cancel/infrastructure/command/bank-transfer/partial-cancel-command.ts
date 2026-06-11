import { runWithTransaction } from '@/shared/infrastructure';
import { Order, ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, OrderProductFindOption } from '@/entities/order-product';
import { OrderRepository, UpdateOrderRequestDto } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import { PointCalculator, PointHistoryRepository } from '@/entities/point';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { OrderProductRepository } from '@/entities/order-product';
import {
  OrderProductApiRepository,
  OrderProductAdapter,
} from '@/entities/order-product/infrastructure';
import { isFullyCancelRequest, isFullyCancelled } from '../../../lib/status-helper';
import { IPartialCancelCommand } from '../../../core';
import { POINT_ACTION } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';

export class BankTransferPartialCancelImmediateCommand implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;
  private readonly orderRepository: OrderRepository;
  private readonly orderProductRepository: OrderProductRepository;
  private readonly pointHistoryRepository: PointHistoryRepository;
  private readonly userRepository: UserRepository;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderRepository = new OrderApiRepository(OrderAdapter());
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
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
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  private async updateOrderProductToCancelled() {
    await this.orderProductRepository.update({
      orderProductId: this.targetOrderProductId,
      data: { orderProductStatus: ORDER_PRODUCT_STATUS.cancelled },
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

  private async rollbackEarnPoint() {
    if (this.order.orderStatus !== ORDER_STATUS.pending) {
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
  }

  private async rollbackUsePoint() {
    const user = await this.userRepository.findById(this.order.user);
    const history = await this.pointHistoryRepository.createRollbackHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
      type: POINT_ACTION.cancel_use,
    });
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistory(history),
      action: POINT_ACTION.cancel_use,
    });

    await this.userRepository.update({
      user: this.order.user,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductRepository.findMany(option);
    const orderProductStatuses = orderProducts.map(
      (orderProduct) => orderProduct.orderProductStatus,
    );

    if (isFullyCancelRequest(orderProductStatuses)) {
      return ORDER_STATUS.cancel_request;
    }

    if (isFullyCancelled(orderProductStatuses)) {
      return ORDER_STATUS.cancelled;
    }

    return this.order.orderStatus;
  }
}

export class BankTransferPartialCancelRequestCommand implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;
  private readonly orderRepository: OrderRepository;
  private readonly orderProductRepository: OrderProductRepository;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderRepository = new OrderApiRepository(OrderAdapter());
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
  }

  public async run() {
    await this.updateOrderProductToCancelled();
    await this.updateOrderStatus();
  }

  private async updateOrderProductToCancelled() {
    await this.orderProductRepository.update({
      orderProductId: this.targetOrderProductId,
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.cancel_request,
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

    if (isFullyCancelRequest(orderProductStatuses)) {
      return ORDER_STATUS.cancel_request;
    }

    if (isFullyCancelled(orderProductStatuses)) {
      return ORDER_STATUS.cancelled;
    }

    return this.order.orderStatus;
  }

  public async execute() {
    return await runWithTransaction(this);
  }
}

export class AdminBankTransferPartialCancel implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;
  private readonly orderRepository: OrderRepository;
  private readonly orderProductRepository: OrderProductRepository;
  private readonly pointHistoryRepository: PointHistoryRepository;
  private readonly userRepository: UserRepository;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderRepository = new OrderApiRepository(OrderAdapter());
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
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

  private async rollbackEarnPoint() {
    if (this.order.orderStatus !== ORDER_STATUS.pending) {
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
  }

  private async rollbackUsePoint() {
    const user = await this.userRepository.findById(this.order.user);
    const history = await this.pointHistoryRepository.createRollbackHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
      type: POINT_ACTION.cancel_use,
    });
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistory(history),
      action: POINT_ACTION.cancel_use,
    });

    await this.userRepository.update({
      user: this.order.user,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductRepository.findMany(option);
    const orderProductStatuses = orderProducts.map(
      (orderProduct) => orderProduct.orderProductStatus,
    );

    if (isFullyCancelRequest(orderProductStatuses)) {
      return ORDER_STATUS.cancel_request;
    }

    if (isFullyCancelled(orderProductStatuses)) {
      return ORDER_STATUS.cancelled;
    }

    return this.order.orderStatus;
  }
}
