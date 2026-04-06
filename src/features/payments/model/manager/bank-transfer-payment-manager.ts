import { PaymentManager } from './payment-manager';
import { Inventory, InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { DeliveryFeeManager } from '@/entities/inventory/lib/delivery-fee-manager';
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
import { zodSafeParse } from '@/shared/lib/zod';

export class BankTransferPaymentManager<
  TContext extends BankTransferPaymentInitContext,
> extends PaymentManager<TContext> {
  protected constructor(
    inventory: Inventory,
    deliveryFeeManager: DeliveryFeeManager,
    pointAllocator: PointAllocator,
    context: TContext,
  ) {
    super(inventory, deliveryFeeManager, pointAllocator, context);
  }

  static createContext(dto: OrderBankTransferDto) {
    const context = zodSafeParse(bankTransferPaymentInitContextSchema, dto);
    return context;
  }

  static async create(context: BankTransferPaymentInitContext) {
    const inventory = await transformOrderListToInventory(context.orderList);
    const deliveryFeeManager = new DeliveryFeeManager(inventory, context.minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryFeeManager, context.usedPoint);

    return new BankTransferPaymentManager(inventory, deliveryFeeManager, pointAllocator, context);
  }

  public async createOrder() {
    const dto = PaymentDto.createOrderForBankTransfer(this.context);
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

  public async processOrderSideEffects(
    this: BankTransferPaymentManager<BankTransferPaymentContextAfterOrder>,
  ) {
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

  private async createOrderProduct(
    this: BankTransferPaymentManager<BankTransferPaymentContextAfterOrder>,
    inventoryItem: InventoryItem,
  ) {
    const subtotal = this.deliveryFeeManager.getOrderProductSubtotal(inventoryItem);
    const totalAmount = subtotal - this.pointAllocator.getAllocatedPoint(inventoryItem.product.id);
    const productDeliveryFee = this.deliveryFeeManager.getOrderProductDeliveryFee(inventoryItem);

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
