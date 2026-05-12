import { runWithTransaction } from '@/shared/infrastructure';
import { type IPartialCancelCommand } from '../cancel-command';
import { IOrderService, Order, ORDER_STATUS } from '@/entities/order';
import { IOrderProductService, OrderProductService } from '@/entities/order-product/infrastructure';
import { ORDER_PRODUCT_STATUS, OrderProductFindOption } from '@/entities/order-product';
import { OrderService } from '@/entities/order/infrastructure';
import { getUpdateOrderStatus } from '../../../lib/order-status-resolver';

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
    /**
     * [step] 주문상품 상태 바꾸기 (주문취소)
     * [step] 사용포인트 반환
     * [step] 적립금 반환 (admin 추가 액션 - admin에서는 모든상태에서 취소가 가능하기에)
     * [step] 주문상태 바꾸기
     *  -> 조회
     *  -> 모두 취소인가?, 모두 취소 요청인가?
     *  -> 모두 [취소상태] 라면
     *    - 주문취소
     *  -> 하나라도 [취소요청상태] 라면
     *    -> 취소요청
     *  -> 하나라도 transition 가능한 상태라면
     *    - currentStatus
     */

    // [step] 주문상품 상태 바꾸기 (주문취소)
    await this.updateOrderProductToCancelled();

    // [step] 사용포인트 반환
    await this.rollbackUsePoint();
    // [step] 적립금 반환
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
    const option = OrderProductFindOption.partialCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductService.getOrderProducts(option);

    const orderProductStatuses = orderProducts.map(
      (orderProduct) => orderProduct.orderProductStatus,
    );
    const updatedOrderStatus = getUpdateOrderStatus(orderProductStatuses);
    await this.orderService.updateOrder(this.order, { orderStatus: updatedOrderStatus });
  }

  private async rollbackEarnPoint() {
    // client에서는 -> peding상태에서 사용, admin에서는 모든 상태에서 사용
    // peding이라면 포인트 적립 내역이 아직 없는 상태 그외라면 있다.
    if (this.order.orderStatus !== ORDER_STATUS.pending) {
      // 찾고ㅓ
    }
  }

  private async rollbackUsePoint() {}

  // rollback 작성 후 진행
  private async updateUserPoint() {}
}

/** Completed */
export class BankTransferPartialCancelRequestCommand implements IPartialCancelCommand {
  private readonly order: Order;
  private readonly targetOrderProductId: number;

  constructor(order: Order, orderProductId: number) {
    this.order = order;
    this.targetOrderProductId = orderProductId;
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
    const orderService = new OrderService();
    await orderService.updateOrder(this.order, { orderStatus: ORDER_STATUS.cancel_request });
  }

  public async execute() {
    return await runWithTransaction(this);
  }
}
