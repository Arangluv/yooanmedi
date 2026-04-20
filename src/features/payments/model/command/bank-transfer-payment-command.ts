import { zodSafeParse } from '@/shared/lib/zod';
import { PaymentCommand } from './payment-command';
import {
  type BankTransferRequestDto,
  toBankTransferServiceDto,
} from '../schema/banktransfer-request.schema';
import {
  bankTransferPaymentInitContextSchema,
  BankTransferPaymentInitContext,
  BankTransferPaymentContextAfterOrder,
} from '../schema/payment-context-schema';
import { PaymentDto } from '../schema/payments.dto';
import { EnrichedOrderList, EnrichedOrderListItem } from '../schema/order-list.schema';
import { enrichedOrderListFromContext } from '../enriched-order-list';
import { UsePointTransaction } from '@/entities/point/model/point-transaction';
import { OrderService } from '@/entities/order/model/services/service';
import { PAYMENTS_METHOD } from '@/entities/order';
import { OrderProductService } from '@/entities/order-product/model/services/service';
import { runWithTransaction } from '@/shared/lib/run-with-transaction';

export class BankTransferPaymentCommand<
  TContext extends BankTransferPaymentInitContext,
> extends PaymentCommand<TContext> {
  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    super(orderList, context);
  }

  static createContext(requestDto: BankTransferRequestDto) {
    const dto = toBankTransferServiceDto(requestDto);
    const context = zodSafeParse(bankTransferPaymentInitContextSchema, dto);
    return context;
  }

  static async create(context: BankTransferPaymentInitContext) {
    const orderList = await enrichedOrderListFromContext(context);
    return new BankTransferPaymentCommand(orderList, context);
  }

  public async run(): Promise<void> {
    const order = await this.createOrder();
    this.applyOrderIdToContext(order.id);

    await this.processOrderList();
  }

  public async execute(): Promise<void> {
    return await runWithTransaction(this);
  }

  private async createOrder() {
    const orderService = OrderService.for(PAYMENTS_METHOD.BANK_TRANSFER);
    const dto = PaymentDto.createOrderForBankTransfer(this.context);
    const order = await orderService.createOrder(dto);

    return order;
  }

  private applyOrderIdToContext(
    orderId: number,
  ): asserts this is BankTransferPaymentCommand<BankTransferPaymentContextAfterOrder> {
    this.context = {
      ...this.context,
      orderId,
    };
  }

  private async processOrderList(
    this: BankTransferPaymentCommand<BankTransferPaymentContextAfterOrder>,
  ) {
    const usePointTransaction = new UsePointTransaction();

    await Promise.all(
      this.orderList.map(async (orderListItem) => {
        // step 2-1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(orderListItem);
        // step 2-2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(orderListItem);
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
    this: BankTransferPaymentCommand<BankTransferPaymentContextAfterOrder>,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductService = OrderProductService.for(PAYMENTS_METHOD.BANK_TRANSFER);
    const requestDto = PaymentDto.createOrderProduct(this.context, orderListItem);
    const orderProduct = await orderProductService.createOrderProduct(requestDto);

    return orderProduct;
  }
}
