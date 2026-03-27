import { PaymentManager } from './payment-manager';
import { Inventory } from '@/entities/inventory/model/inventory-schema';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { OrderBankTransferDto } from '../schema/order-banktransfer-schema';
import {
  BankTransferPaymentContext,
  bankTransferPaymentContextSchema,
} from '../schema/payment-context-schema';
import { transformOrderListToInventory } from '@/entities/inventory/lib/transform';

export class BankTransferPaymentManager extends PaymentManager {
  protected constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    context: BankTransferPaymentContext,
  ) {
    super(inventory, deliveryInfoManager, pointAllocator, context);
  }

  static createContext(dto: OrderBankTransferDto) {
    return bankTransferPaymentContextSchema.parse(dto);
  }

  static async create(context: BankTransferPaymentContext) {
    const inventory = await transformOrderListToInventory(context.orderList);
    const deliveryInfoManager = new DeliveryInfoManager(inventory, context.minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryInfoManager, context.usedPoint);

    return new BankTransferPaymentManager(inventory, deliveryInfoManager, pointAllocator, context);
  }

  async createOrder() {}
}
