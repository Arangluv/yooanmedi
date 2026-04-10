import { createOrder as createOrderFromEntityLayer } from '@/entities/order/api/create-order';
import { createOrderProduct as createOrderProductFromEntityLayer } from '@/entities/order-product/api/create-order-product';
import { zodSafeParse } from '@/shared/lib/zod';
import { withTransaction } from '@/shared/lib/with-transaction';

import { PaymentManager } from './payment-manager';
import { OrderBankTransferDto } from '../schema/order-banktransfer-schema';
import {
  bankTransferPaymentInitContextSchema,
  BankTransferPaymentInitContext,
  BankTransferPaymentContextAfterOrder,
} from '../schema/payment-context-schema';
import { PaymentDto } from '../schema/payments.dto';
import { EnrichedOrderList, EnrichedOrderListItem } from '../schema/order-list.schema';
import { enrichedOrderListFromContext } from '../enriched-order-list';
import { UsePointTransaction } from '@/entities/point/model/point-transaction';
import { UsecaseResult } from '@/shared/model/type';

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

  public async execute(): Promise<UsecaseResult> {
    await withTransaction({
      callback: async () => {
        const order = await this.createOrder();
        this.applyOrderIdToContext(order.id);

        const manager = this as BankTransferPaymentManager<BankTransferPaymentContextAfterOrder>;
        await manager.processOrderList();
      },
    });

    return {
      message: '무통장 입금 주문을 생성하였습니다.',
    };
  }

  private async createOrder() {
    const dto = PaymentDto.createOrderForBankTransfer(this.context);
    const order = await createOrderFromEntityLayer(dto);

    return order;
  }

  private applyOrderIdToContext(
    orderId: number,
  ): asserts this is BankTransferPaymentManager<BankTransferPaymentContextAfterOrder> {
    this.context = {
      ...this.context,
      orderId,
    };
  }

  private async processOrderList(
    this: BankTransferPaymentManager<BankTransferPaymentContextAfterOrder>,
  ) {
    const usePointTransaction = new UsePointTransaction();

    await Promise.all(
      this.orderList.map(async (orderListItem) => {
        // step 2-1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(orderListItem);
        // step 2-2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(orderListItem);
        // step 2-3. 사용 포인트 차감 히스토리 생성
        await usePointTransaction.createHistory({
          user: this.context.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
        });
      }),
    );

    // step 3. 사용 포인트 차감
    await usePointTransaction.updateUserPoint(this.context.userId, this.context.usedPoint);
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
