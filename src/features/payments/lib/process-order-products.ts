import { transformOrderListToInventory } from '@/entities/inventory';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { type Inventory, type InventoryItem } from '@/entities/inventory/model/inventory-schema';

import { type OrderBankTransferDto } from '../model/order-banktransfer-schema';
import {
  buildBankTransferOrderProductDto,
  buildCreateCreditCardOrderProductDto,
} from './build-payments-dto';
import { createOrderProduct } from '@/entities/order-product/api/create-order-product';
import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';
import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history';
import { createUsePointTransaction } from '@/entities/point/lib/use/create-transaction';

export class OrderProductsManager {
  private inventory: Inventory;
  private deliveryInfoManager: DeliveryInfoManager;
  private pointAllocator: PointAllocator;
  private orderId: number;

  private constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    orderId: number,
  ) {
    this.inventory = inventory;
    this.deliveryInfoManager = deliveryInfoManager;
    this.pointAllocator = pointAllocator;
    this.orderId = orderId;
  }

  static async create(dto: OrderBankTransferDto, orderId: number) {
    const inventory = await transformOrderListToInventory(dto.orderList);
    const deliveryInfoManager = new DeliveryInfoManager(inventory, dto.minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryInfoManager, dto.usedPoint);

    return new OrderProductsManager(inventory, deliveryInfoManager, pointAllocator, orderId);
  }

  async processOrderSideEffectsForBankTransfer() {
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        await this.createBankTransferOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
      }),
    );
  }

  async processOrderSideEffectsForCreditCard() {
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        await this.createCreditCardOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
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

  // 주문 상품 생성 (신용카드 결제)
  private async createCreditCardOrderProduct(inventoryItem: InventoryItem) {
    const orderProductSubtotal = this.deliveryInfoManager.getOrderProductSubtotal(inventoryItem);
    const orderProductTotalAmount =
      orderProductSubtotal - this.pointAllocator.getAllocatedPoint(inventoryItem.product.id);

    const createOrderProductDto = buildCreateCreditCardOrderProductDto({
      orderId: this.orderId,
      totalAmount: orderProductTotalAmount,
      productDeliveryFee: this.deliveryInfoManager.getOrderProductDeliveryFee(inventoryItem),
      inventoryItem,
    });
    const orderProduct = await createOrderProduct(createOrderProductDto);

    return orderProduct;
  }

  private async makeRecentPurchasedHistory(inventoryItem: InventoryItem): Promise<void> {
    const dto = createRecentPurchasedHistorySchema.parse({
      user: this.orderId,
      product: inventoryItem.product.id,
      quantity: inventoryItem.quantity,
      amount: inventoryItem.product.price,
    });

    const recentPurchasedHistory = await createRecentPurchasedHistory(dto);
  }

  // 사용 포인트 차감
  private async deductUsedPoint(inventoryItem: InventoryItem): Promise<void> {
    await createUsePointTransaction({
      userId: 1,
      orderProductId: 1,
      amount: this.pointAllocator.getAllocatedPoint(inventoryItem.product.id),
    });
  }

  // 구매 포인트 적립
  private async accumulatePoint(inventoryItem: InventoryItem): Promise<void> {}
}
