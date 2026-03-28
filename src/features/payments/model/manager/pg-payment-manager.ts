import { PaymentManager } from './payment-manager';
import { Inventory, InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { PAYMENTS_RESPONSE_SUCCESS_CODE } from '../../constants/payment-gateway-code';
import { PaymentRegisterResult, paymentRegisterSchema } from '../schema/register-response-schema';
import {
  PGPaymentContextAfterApproval,
  PGPaymentContextAfterOrder,
  PGPaymentInitContext,
  pgPaymentInitContextSchema,
} from '../schema/payment-context-schema';
import { paymentsApproval } from '../../api/payment-approval';
import {
  ApprovalPaymentResult,
  approvalPaymentResultSchema,
} from '../schema/payments-approval-schema';
import { transformOrderListToInventory } from '@/entities/inventory/lib/transform';
import { PaymentDto } from '../schema/payments.dto';
import { createOrder as createOrderFromEntityLayer } from '@/entities/order';
import { createOrderProduct as createOrderProductFromEntityLayer } from '@/entities/order-product/api/create-order-product';
import { createEarnPointTransaction } from '@/entities/point/lib/earn/create-transaction';
import { getPointWhenUsingCard } from '@/entities/point/lib/calculator';
import { createPayment } from '@/entities/payment/api/create';

export class PGPaymentManager<
  TContext extends PGPaymentInitContext,
> extends PaymentManager<TContext> {
  protected constructor(
    inventory: Inventory,
    deliveryInfoManager: DeliveryInfoManager,
    pointAllocator: PointAllocator,
    context: TContext,
  ) {
    super(inventory, deliveryInfoManager, pointAllocator, context);
  }

  static async create(context: PGPaymentInitContext) {
    const inventory = await transformOrderListToInventory(context.orderList);
    const deliveryInfoManager = new DeliveryInfoManager(inventory, context.minOrderPrice);
    const pointAllocator = new PointAllocator(deliveryInfoManager, context.usedPoint);

    return new PGPaymentManager(inventory, deliveryInfoManager, pointAllocator, context);
  }

  static validatePaymentRegister(formData: FormData) {
    let data = {} as Record<string, string>;
    formData.forEach((value: any, key: string) => {
      data[key as string] = value;
    });

    // todo : dto로 빼도 되지않을까
    const registerResult: PaymentRegisterResult = paymentRegisterSchema.parse(data);

    // todo : 타입추론?
    if (registerResult.resCd !== PAYMENTS_RESPONSE_SUCCESS_CODE) {
      throw new Error('결제 등록과정에서 문제가 발생했습니다');
    }

    return registerResult;
  }

  static createInitialContext(data: PaymentRegisterResult) {
    return pgPaymentInitContextSchema.parse(data);
  }

  public async approvePayment() {
    const approvalDto = PaymentDto.approvePayment(this.context);
    const result = await paymentsApproval(approvalDto);

    const approvalResult = approvalPaymentResultSchema.parse(result);

    return approvalResult;
  }

  public applyApprovalResultToContext(
    approvalResult: ApprovalPaymentResult,
  ): asserts this is PGPaymentManager<PGPaymentContextAfterApproval> {
    const {
      amount,
      pgCno,
      paymentInfo: { approvalDate },
    } = approvalResult;

    this.context = {
      ...this.context,
      amount,
      pgCno,
      approvalDate,
    };
  }

  public applyOrderIdToContext(
    orderId: number,
  ): asserts this is PGPaymentManager<PGPaymentContextAfterOrder> {
    this.context = {
      ...this.context,
      orderId,
    };
  }

  public async createOrder(this: PGPaymentManager<PGPaymentContextAfterApproval>) {
    if (this.context.amount === undefined) {
      throw new Error('amount가 설정되지 않았습니다');
    }

    const dto = PaymentDto.createOrder(this.context);
    const order = await createOrderFromEntityLayer({ dto });

    return order;
  }

  /**
   * side effect: 주문 상품 생성, 구매 히스토리 생성, 사용 포인트 차감, 구매 포인트 적립
   */
  public async processOrderSideEffects() {
    await Promise.all(
      this.inventory.map(async (inventoryItem: InventoryItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(inventoryItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(inventoryItem);
        // step 3. 사용 포인트 차감
        await this.deductUsedPoint(inventoryItem, orderProduct.id);
        // step 4. 구매 포인트 적립
        await this.accumulatePoint(inventoryItem, orderProduct.id);
      }),
    );
  }

  public async createPaymentHistory() {
    const dto = PaymentDto.createPaymentHistory(this.context);
    await createPayment(dto);
  }

  public getContext(): TContext {
    return this.context;
  }

  private async createOrderProduct(inventoryItem: InventoryItem) {
    const subtotal = this.deliveryInfoManager.getOrderProductSubtotal(inventoryItem);
    const totalAmount = subtotal - this.pointAllocator.getAllocatedPoint(inventoryItem.product.id);
    const productDeliveryFee = this.deliveryInfoManager.getOrderProductDeliveryFee(inventoryItem);

    const orderProductDto = PaymentDto.createOrderProductForPg(
      this.context,
      inventoryItem,
      totalAmount,
      productDeliveryFee,
    );
    const orderProduct = await createOrderProductFromEntityLayer(orderProductDto);

    return orderProduct;
  }

  // 구매 포인트 적립 (PG사 결제는 구매시점에 바로 적립)
  private async accumulatePoint(inventoryItem: InventoryItem, orderProductId: number) {
    await createEarnPointTransaction({
      userId: this.context.userId,
      orderProductId: orderProductId,
      amount: getPointWhenUsingCard(inventoryItem.product) * inventoryItem.quantity,
    });
  }
}
