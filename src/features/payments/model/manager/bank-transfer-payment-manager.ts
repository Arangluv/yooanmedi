import { PaymentManager } from './payment-manager';
import { Inventory, InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { OrderBankTransferDto } from '../schema/order-banktransfer-schema';
import {
  bankTransferPaymentInitContextSchema,
  BankTransferPaymentInitContext,
  BankTransferPaymentContextAfterOrder,
} from '../schema/payment-context-schema';
import { transformOrderListToInventory } from '@/entities/inventory/lib/transform';
import { PaymentDto } from '../schema/payments.dto';
import { createOrder as createOrderFromEntityLayer } from '@/entities/order';
import { createOrderProduct as createOrderProductFromEntityLayer } from '@/entities/order-product/api/create-order-product';

export class BankTransferPaymentManager<
  TContext extends BankTransferPaymentInitContext,
> extends PaymentManager<TContext> {
  protected constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    context: TContext,
  ) {
    super(inventory, deliveryInfoManager, pointAllocator, context);
  }

  static createContext(dto: OrderBankTransferDto) {
    return bankTransferPaymentInitContextSchema.parse(dto);
  }

  static async create(context: BankTransferPaymentInitContext) {
    const inventory = await transformOrderListToInventory(context.orderList);
    const deliveryInfoManager = new DeliveryInfoManager(inventory, context.minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryInfoManager, context.usedPoint);

    return new BankTransferPaymentManager(inventory, deliveryInfoManager, pointAllocator, context);
  }

  public async createOrder() {
    const dto = PaymentDto.createOrder(this.context);
    const order = await createOrderFromEntityLayer({ dto });

    return order;
  }

  public applyOrderIdToContext(
    orderId: number,
  ): asserts this is BankTransferPaymentManager<BankTransferPaymentContextAfterOrder> {
    this.context = {
      ...this.context,
      orderId,
    };
  }

  public async processOrderSideEffects() {
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
        // step 3. 사용 포인트 차감
        await this.deductUsedPoint(inventoryItem, orderProduct.id);
      }),
    );
  }

  private async createOrderProduct(inventoryItem: InventoryItem) {
    const subtotal = this.deliveryInfoManager.getOrderProductSubtotal(inventoryItem);
    const totalAmount = subtotal - this.pointAllocator.getAllocatedPoint(inventoryItem.product.id);

    const productDeliveryFee = this.deliveryInfoManager.getOrderProductDeliveryFee(inventoryItem);

    const orderProductDto = PaymentDto.createOrderProductForBankTransfer(
      this.context,
      inventoryItem,
      totalAmount,
      productDeliveryFee,
    );
    const orderProduct = await createOrderProductFromEntityLayer(orderProductDto);

    return orderProduct;
  }
}
