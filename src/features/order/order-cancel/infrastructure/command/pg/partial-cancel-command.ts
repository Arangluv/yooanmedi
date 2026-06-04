import { runWithTransaction } from '@/shared/infrastructure';
import { IOrderService, Order, ORDER_STATUS } from '@/entities/order';
import { OrderProductRepository } from '@/entities/order-product';
import { OrderProductApiRepository, OrderProductAdapter } from '@/entities/order-product/infrastructure';
import { ORDER_PRODUCT_STATUS, OrderProductFindOption } from '@/entities/order-product';
import { OrderService } from '@/entities/order/infrastructure';
import { PointTransactionServiceFactory } from '@/entities/point/infrastructure';
import { EasyPayService, IEasyPay } from '@/entities/easypay';
import { PaymentHistoryApiRepository, PaymentHistoryAdapter } from '@/entities/payment/infrastructure';
import { isFullyCancelled } from '../../../lib/status-helper';
import { type IPartialCancelCommand } from '../../../core';

export class PGPartialCancelCommand implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;
  private readonly orderService: IOrderService;
  private readonly orderProductRepository: OrderProductRepository;
  private readonly easypayService: IEasyPay;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
    this.orderService = new OrderService();
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    this.easypayService = new EasyPayService();
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
    await this.orderService.updateOrder(this.order, { orderStatus: orderOnGoingStatus });
  }

  private async getOrderOnGoingStatus() {
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductRepository.findMany(option);
    const orderProductStatuses = orderProducts.map((orderProduct) => orderProduct.orderProductStatus);

    if (isFullyCancelled(orderProductStatuses)) {
      return ORDER_STATUS.cancelled;
    }

    return this.order.orderStatus;
  }

  private async rollbackEarnPoint() {
    const cancelEarnPointService = PointTransactionServiceFactory.forCancelEarn();
    const history = await cancelEarnPointService.createHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
    });

    await cancelEarnPointService.updateUserPointFromHistories(this.order.user, [history]);
  }

  private async rollbackUsePoint() {
    const cancelUsePointService = PointTransactionServiceFactory.forCancelUse();
    const history = await cancelUsePointService.createHistory({
      user: this.order.user,
      orderProduct: this.targetOrderProductId,
    });

    await cancelUsePointService.updateUserPointFromHistories(this.order.user, [history]);
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
