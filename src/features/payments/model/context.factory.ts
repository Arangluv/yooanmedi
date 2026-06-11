import { zodSafeParse, generate15digitsNumberBasedOnDate, PAYMENTS_METHOD } from '@/shared';
import { EasyPayPaymentAuthenticationDto } from '@/entities/easypay';
import {
  basePaymentContextSchema,
  type BasePaymentContext,
} from './schemas/payments-context/base.schema';
import { bankTransferPaymentInitContextSchema } from './schemas/payments-context/bank-transfer.schema';
import { type BankTransferRequestDto } from './schemas/bank-transfer-request.schema';
import { EnrichedOrderList } from './schemas/payment-order-list.schema';
import { paymentInitContextSchema } from './schemas/payments-context/pg.schema';

export interface PaymentContextFactory {
  createBase(data: unknown): BasePaymentContext;
  initialize(data: unknown): any;
}

export class BankTransferContextFactory implements PaymentContextFactory {
  createBase(dto: BankTransferRequestDto) {
    return zodSafeParse(basePaymentContextSchema, {
      ...dto,
      shopOrderNo: generate15digitsNumberBasedOnDate(),
    });
  }

  initialize(ctx: BasePaymentContext & { orderList: EnrichedOrderList; amount: number }) {
    return zodSafeParse(bankTransferPaymentInitContextSchema, {
      ...ctx,
      paymentsMethod: PAYMENTS_METHOD.bank_transfer,
    });
  }
}

export class PGContextFactory implements PaymentContextFactory {
  createBase(dto: EasyPayPaymentAuthenticationDto) {
    return zodSafeParse(basePaymentContextSchema, {
      shopOrderNo: generate15digitsNumberBasedOnDate(),
      deliveryRequest: dto.deliveryRequest,
      orderList: dto.orderList,
      usedPoint: dto.usedPoint,
      userId: dto.userId,
      minOrderPrice: dto.minOrderPrice,
    });
  }

  initialize(ctx: BasePaymentContext & { orderList: EnrichedOrderList; authorizationId: string }) {
    return zodSafeParse(paymentInitContextSchema, {
      ...ctx,
      paymentsMethod: PAYMENTS_METHOD.credit_card,
    });
  }
}
