import { DeliveryFeeManager } from '@/entities/inventory/lib/delivery-fee-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { type Inventory, type InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history/api/create';
// import { createUsePointTransaction } from '@/entities/point/lib/use/create-transaction';
import { BasePaymentContext } from '../schema/payment-context-schema';
import { Order } from '@/entities/order/model/type';
import { PaymentDto } from '../schema/payments.dto';
import { UsePointTransaction } from '@/entities/point/lib/use/point-transaction';

export abstract class PaymentManager<TContext extends BasePaymentContext> {
  protected inventory: Inventory;
  protected deliveryFeeManager: DeliveryFeeManager;
  protected pointAllocator: PointAllocator;
  protected context: TContext;

  abstract createOrder(): Promise<Order>;
  abstract processOrderSideEffects(): Promise<void>;

  protected constructor(
    inventory: Inventory,
    deliveryFeeManager: DeliveryFeeManager,
    pointAllocator: PointAllocator,
    context: TContext,
  ) {
    this.inventory = inventory;
    this.deliveryFeeManager = deliveryFeeManager;
    this.pointAllocator = pointAllocator;
    this.context = context;
  }

  // 결제 컨텍스트 조회
  public getContext(): TContext {
    return this.context;
  }

  // 구매 히스토리 생성
  protected async makeRecentPurchasedHistory(inventoryItem: InventoryItem): Promise<void> {
    const dto = PaymentDto.createRecentPurchasedHistory(this.context, inventoryItem);
    await createRecentPurchasedHistory(dto);
  }

  // 사용 포인트 차감
  protected async deductUsedPoint(
    inventoryItem: InventoryItem,
    orderProductId: number,
  ): Promise<void> {
    const paymentPointTransaction = new UsePointTransaction({
      userId: this.context.userId,
      orderProductId: orderProductId,
    });
    const amount = this.pointAllocator.getAllocatedPoint(inventoryItem.product.id);
    await paymentPointTransaction.initializeContext();
    await paymentPointTransaction.createHistory(amount);
    await paymentPointTransaction.deductUserPoint(amount);
  }
}
