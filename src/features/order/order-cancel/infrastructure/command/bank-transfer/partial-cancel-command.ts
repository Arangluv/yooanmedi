import { runWithTransaction } from '@/shared/infrastructure';
import { IOrderService, Order, ORDER_STATUS } from '@/entities/order';
import { IOrderProductService, OrderProductService } from '@/entities/order-product/infrastructure';
import { ORDER_PRODUCT_STATUS, OrderProductFindOption } from '@/entities/order-product';
import { OrderService } from '@/entities/order/infrastructure';
import {
  CancelEarnPointTransaction,
  CancelUsePointTransaction,
} from '@/entities/point/model/point-transaction';
import { isFullyCancelRequest, isFullyCancelled } from '../../../lib/status-helper';
import { IPartialCancelCommand } from '../../../core';

export class BankTransferPartialCancelImmediateCommand implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;
  private readonly orderService: IOrderService;
  private readonly orderProductService: IOrderProductService;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderService = new OrderService();
    this.orderProductService = new OrderProductService();
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
    await this.orderProductService.updateOrderProduct(this.targetOrderProductId, {
      orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
    });
  }

  private async updateOrderStatus() {
    const orderOnGoingStatus = await this.getOrderOnGoingStatus();
    await this.orderService.updateOrder(this.order, { orderStatus: orderOnGoingStatus });
  }

  private async rollbackEarnPoint() {
    if (this.order.orderStatus !== ORDER_STATUS.pending) {
      const cancelEarnPointService = new CancelEarnPointTransaction();
      await cancelEarnPointService.createHistory({
        user: this.order.user,
        orderProduct: this.targetOrderProductId,
      });

      await cancelEarnPointService.updateUserPoint(this.order.user);
    }
  }

  private async rollbackUsePoint() {
    const cancelUsePointService = new CancelUsePointTransaction();
    await cancelUsePointService.createHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
    });

    await cancelUsePointService.updateUserPoint(this.order.user);
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductService.getOrderProductsWithTransaction(option);
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
  private readonly orderService: IOrderService;
  private readonly orderProductService: IOrderProductService;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderService = new OrderService();
    this.orderProductService = new OrderProductService();
  }

  public async run() {
    await this.updateOrderProductToCancelled();
    await this.updateOrderStatus();
  }

  private async updateOrderProductToCancelled() {
    const orderProductService = new OrderProductService();
    await orderProductService.updateOrderProduct(this.targetOrderProductId, {
      orderProductStatus: ORDER_PRODUCT_STATUS.cancel_request,
    });
  }

  private async updateOrderStatus() {
    const orderOnGoingStatus = await this.getOrderOnGoingStatus();
    await this.orderService.updateOrder(this.order, { orderStatus: orderOnGoingStatus });
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductService.getOrderProductsWithTransaction(option);
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
  private readonly orderService: IOrderService;
  private readonly orderProductService: IOrderProductService;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderService = new OrderService();
    this.orderProductService = new OrderProductService();
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
    await this.orderProductService.updateOrderProduct(this.targetOrderProductId, {
      orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
    });
  }

  private async updateOrderStatus() {
    const orderOnGoingStatus = await this.getOrderOnGoingStatus();
    await this.orderService.updateOrder(this.order, { orderStatus: orderOnGoingStatus });
  }

  private async rollbackEarnPoint() {
    if (this.order.orderStatus !== ORDER_STATUS.pending) {
      const cancelEarnPointService = new CancelEarnPointTransaction();
      await cancelEarnPointService.createHistory({
        user: this.order.user,
        orderProduct: this.targetOrderProductId,
      });

      await cancelEarnPointService.updateUserPoint(this.order.user);
    }
  }

  private async rollbackUsePoint() {
    const cancelUsePointService = new CancelUsePointTransaction();
    await cancelUsePointService.createHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
    });

    await cancelUsePointService.updateUserPoint(this.order.user);
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductService.getOrderProductsWithTransaction(option);
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
