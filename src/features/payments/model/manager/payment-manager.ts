import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { type Inventory, type InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history';
import { createUsePointTransaction } from '@/entities/point/lib/use/create-transaction';
import { BasePaymentContext } from '../schema/payment-context-schema';
import { Order } from '@/entities/order/model/type';
import { PaymentDto } from '../schema/payments.dto';

export abstract class PaymentManager<TContext extends BasePaymentContext> {
  protected inventory: Inventory;
  protected deliveryInfoManager: DeliveryInfoManager;
  protected pointAllocator: PointAllocator;
  protected context: TContext;

  abstract createOrder(): Promise<Order>;
  abstract processOrderSideEffects(): Promise<void>;

  protected constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    context: TContext,
  ) {
    this.inventory = inventory;
    this.deliveryInfoManager = deliveryInfoManager;
    this.pointAllocator = pointAllocator;
    this.context = context;
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
    if (this.context.usedPoint === 0) {
      return;
    }

    if (this.context.usedPoint < 0) {
      throw new Error('사용 포인트는 0 이상이어야 합니다');
    }

    await createUsePointTransaction({
      userId: this.context.userId,
      orderProductId: orderProductId,
      amount: this.pointAllocator.getAllocatedPoint(inventoryItem.product.id),
    });
  }
}
