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
import { createEarnPointTransaction } from '@/entities/point/lib/earn/create-transaction';
import { getPointWhenUsingCard } from '@/entities/point';
import { PAYMENTS_METHOD } from '@/entities/order';
import { createPayment } from '@/entities/payment';

export class OrderProductsManager {
  private inventory: Inventory;
  private deliveryInfoManager: DeliveryInfoManager;
  private pointAllocator: PointAllocator;
  private orderId: number;
  private userId: number;
  private usedPoint: number;
  private pgCno?: string;

  private constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    orderId: number,
    userId: number,
    usedPoint: number,
    pgCno?: string,
  ) {
    this.inventory = inventory;
    this.deliveryInfoManager = deliveryInfoManager;
    this.pointAllocator = pointAllocator;
    this.orderId = orderId;
    this.userId = userId;
    this.usedPoint = usedPoint;
    this.pgCno = pgCno;
  }

  static async create(dto: OrderBankTransferDto, orderId: number, userId: number) {
    const inventory = await transformOrderListToInventory(dto.orderList);
    const deliveryInfoManager = new DeliveryInfoManager(inventory, dto.minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryInfoManager, dto.usedPoint);
    const usedPoint = dto.usedPoint;
    const pgCno = dto.pgCno;

    return new OrderProductsManager(
      inventory,
      deliveryInfoManager,
      pointAllocator,
      orderId,
      userId,
      usedPoint,
      pgCno,
    );
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
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createCreditCardOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
        // step 3. 결제 내역 생성
        await this.createCardPaymentHistory(inventoryItem, orderProduct.id);
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

  // 구매 히스토리 생성
  private async makeRecentPurchasedHistory(inventoryItem: InventoryItem): Promise<void> {
    const dto = createRecentPurchasedHistorySchema.parse({
      user: this.userId,
      product: inventoryItem.product.id,
      quantity: inventoryItem.quantity,
      amount: inventoryItem.product.price,
    });

    await createRecentPurchasedHistory(dto);
  }

  // 결제 내역 생성
  private async createCardPaymentHistory(
    inventoryItem: InventoryItem,
    orderProductId: number,
  ): Promise<void> {
    if (this.pgCno) {
      await createPayment({
        order: this.orderId,
        amount: inventoryItem.product.price,
        paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
        pgCno: this.pgCno,
      });
    }
  }

  // 사용 포인트 차감
  private async deductUsedPoint(
    inventoryItem: InventoryItem,
    orderProductId: number,
  ): Promise<void> {
    if (this.usedPoint > 0) {
      await createUsePointTransaction({
        userId: this.userId,
        orderProductId: orderProductId,
        amount: this.pointAllocator.getAllocatedPoint(inventoryItem.product.id),
      });
    }
  }

  // 구매 포인트 적립
  private async accumulatePoint(
    inventoryItem: InventoryItem,
    orderProductId: number,
  ): Promise<void> {
    await createEarnPointTransaction({
      userId: this.userId,
      orderProductId: orderProductId,
      amount: getPointWhenUsingCard(inventoryItem.product) * inventoryItem.quantity,
    });
  }
}
