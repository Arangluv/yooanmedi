import {
  basePaymentContextSchema,
  type BasePaymentContext,
} from './schemas/payments-context/base.schema';
import { bankTransferPaymentInitContextSchema } from './schemas/payments-context/bank-transfer.schema';
import { type BankTransferRequestDto } from './schemas/bank-transfer-request.schema';
import { EnrichedOrderList } from './schemas/payment-order-list.schema';
import { RegisterTransactionResult } from '@/entities/easypay/model/schemas/easypay.register-transaction-result.schema';
import { zodSafeParse, generate15digitsNumberBasedOnDate, PAYMENTS_METHOD } from '@/shared';
import { paymentInitContextSchema } from './schemas/payments-context/pg.schema';

export interface PaymentContextFactory {
  createBase(data: unknown): BasePaymentContext;
  initialize(data: unknown): any;
}

export class BankTransferContextFactory implements PaymentContextFactory {
  createBase(dto: BankTransferRequestDto) {
    return zodSafeParse(basePaymentContextSchema, dto);
  }

  initialize(dto: BankTransferRequestDto & { orderList: EnrichedOrderList }) {
    return zodSafeParse(bankTransferPaymentInitContextSchema, {
      ...dto,
      shopOrderNo: generate15digitsNumberBasedOnDate(),
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
    });
  }
}

/**
 * PG사 결제 context schema
 * 어플리케이션에서 PG사를 통한 결제 요청 시 전달받은 데이터를 파싱하여 결제 컨텍스트를 생성합니다.
 * 전달받은 커스텀벨류(shopValue)를 파싱하여 결제 컨텍스트를 생성합니다.
 * shopValue1: deliveryRequest
 * shopValue2: orderList
 * shopValue3: usedPoint
 * shopValue4: userId
 * shopValue5: paymentsMethod
 * shopValue6: minOrderPrice
 */
export class PGContextFactory implements PaymentContextFactory {
  createBase(dto: RegisterTransactionResult) {
    return zodSafeParse(basePaymentContextSchema, dto);
  }

  initialize(dto: RegisterTransactionResult & { orderList: EnrichedOrderList }) {
    return zodSafeParse(paymentInitContextSchema, {
      authorizationId: dto.authorizationId,
      shopOrderNo: dto.shopOrderNo,
      deliveryRequest: dto.shopValue1,
      orderList: dto.shopValue2,
      usedPoint: dto.shopValue3,
      userId: dto.shopValue4,
      paymentsMethod: dto.shopValue5,
      minOrderPrice: dto.shopValue6,
    });
  }
}
