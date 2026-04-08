import { PaymentManager } from './payment-manager';
import { OrderBankTransferDto } from '../schema/order-banktransfer-schema';
import {
  bankTransferPaymentInitContextSchema,
  BankTransferPaymentInitContext,
  BankTransferPaymentContextAfterOrder,
} from '../schema/payment-context-schema';
import { PaymentDto } from '../schema/payments.dto';
import { createOrder as createOrderFromEntityLayer } from '@/entities/order';
import { createOrderProduct as createOrderProductFromEntityLayer } from '@/entities/order-product/api/create-order-product';
import { zodSafeParse } from '@/shared/lib/zod';
import { withTransaction } from '@/shared/lib/with-transaction';
import { EnrichedOrderList, EnrichedOrderListItem } from '../schema/order-list.schema';
import { enrichedOrderListFromContext } from '../enriched-order-list';

export class BankTransferPaymentManager<
  TContext extends BankTransferPaymentInitContext,
> extends PaymentManager<TContext> {
  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    super(orderList, context);
  }

  static createContext(dto: OrderBankTransferDto) {
    const context = zodSafeParse(bankTransferPaymentInitContextSchema, dto);
    return context;
  }

  static async create(context: BankTransferPaymentInitContext) {
    const orderList = await enrichedOrderListFromContext(context);
    return new BankTransferPaymentManager(orderList, context);
  }

  public async execute() {
    await withTransaction({
      callback: async () => {
        // PaymentManager.someaction1
        // PaymentManager.someaction2
      },
    });
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

  // todo :: 네이밍 변경
  public async processOrderSideEffects(
    this: BankTransferPaymentManager<BankTransferPaymentContextAfterOrder>,
  ) {
    for (const orderListItem of this.orderList) {
      // step 1. 주문 상품 생성
      const orderProduct = await this.createOrderProduct(orderListItem);
      // step 2. 구매 히스토리 생성
      await this.makeRecentPurchasedHistory(orderListItem);
      // step 3. 사용 포인트 차감
      await this.deductUsedPoint(orderListItem, orderProduct.id);
    }
  }

  private async createOrderProduct(
    this: BankTransferPaymentManager<BankTransferPaymentContextAfterOrder>,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductDto = PaymentDto.createOrderProductForBankTransfer(
      this.context,
      orderListItem,
    );
    const orderProduct = await createOrderProductFromEntityLayer(orderProductDto);

    return orderProduct;
  }
}
