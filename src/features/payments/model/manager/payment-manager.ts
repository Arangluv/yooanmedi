import { transformOrderListToInventory } from '@/entities/inventory';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { type Inventory, type InventoryItem } from '@/entities/inventory/model/inventory-schema';

import { type OrderBankTransferDto } from '../schema/order-banktransfer-schema';
import {
  buildBankTransferOrderProductDto,
  buildCreateCreditCardOrderProductDto,
} from '../../lib/build-payments-dto';
import { createOrderProduct } from '@/entities/order-product/api/create-order-product';
import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';
import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history';
import { createUsePointTransaction } from '@/entities/point/lib/use/create-transaction';
import { createEarnPointTransaction } from '@/entities/point/lib/earn/create-transaction';
import { getPointWhenUsingCard } from '@/entities/point';
import { PAYMENTS_METHOD } from '@/entities/order';
import { createPayment } from '@/entities/payment';
import { BasePaymentContext } from '../schema/payment-context-schema';
import { Order } from '@/entities/order/model/type';
import { PaymentsMethod } from '@/entities/order/constants/payments-options';
import { PaymentDto } from '../schema/payments.dto';

export abstract class PaymentManager {
  protected inventory: Inventory;
  protected deliveryInfoManager: DeliveryInfoManager;
  protected pointAllocator: PointAllocator;
  protected context: BasePaymentContext;

  abstract createOrder(): Promise<Order>;

  protected constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    context: BasePaymentContext,
  ) {
    this.inventory = inventory;
    this.deliveryInfoManager = deliveryInfoManager;
    this.pointAllocator = pointAllocator;
    this.context = context;
  }

  async processOrderSideEffectsForBankTransfer() {
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createBankTransferOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
        // step 3. 사용 포인트 차감
        await this.deductUsedPoint(inventoryItem, orderProduct.id);
      }),
    );
  }

  async processOrderSideEffectsForCreditCard() {
    // OrderProducts 생성
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createCreditCardOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
        // step 4. 구매 포인트 적립
        await this.accumulatePoint(inventoryItem, orderProduct.id);
        // step 5. 사용 포인트 차감
        await this.deductUsedPoint(inventoryItem, orderProduct.id);
      }),
    );
  }

  // 주문 상품 생성 (무통장 입금)
  private async createBankTransferOrderProduct(inventoryItem: InventoryItem) {
    const orderProductSubtotal = this.deliveryInfoManager.getOrderProductSubtotal(inventoryItem);
    const orderProductTotalAmount =
      orderProductSubtotal - this.pointAllocator.getAllocatedPoint(inventoryItem.product.id);

    const createOrderProductDto = buildBankTransferOrderProductDto({
      orderId: this.orderId,
      totalAmount: orderProductTotalAmount,
      productDeliveryFee: this.deliveryInfoManager.getOrderProductDeliveryFee(inventoryItem),
      inventoryItem,
    });
    const orderProduct = await createOrderProduct(createOrderProductDto);

    return orderProduct;
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
