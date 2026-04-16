import { zodSafeParse } from '@/shared/lib/zod';
import {
  easypayRegisterTransactionResponseSchema,
  type EasypayRegisterTransactionRequestDto,
  type EasypayRegisterTransactionResponseDto,
} from '../model/schemas/easypay.register-transaction.schema';
import {
  paymentApprovalResultSchema,
  type PaymentApprovalServiceDto,
} from '../model/schemas/easypay.payment-approval.schema';
import { registerTransaction as registerTransactionApi } from './register-transaction';
import { approvePayment } from './approve-payment';

export class EasyPayRepository {
  public static async registerTransaction(
    dto: EasypayRegisterTransactionRequestDto,
  ): Promise<EasypayRegisterTransactionResponseDto> {
    const result = await registerTransactionApi(dto);
    return zodSafeParse(easypayRegisterTransactionResponseSchema, result);
  }

  public static async approvePayment(dto: PaymentApprovalServiceDto) {
    const approvalResult = await approvePayment(dto);
    return paymentApprovalResultSchema(approvalResult);
    // return zodSafeParse(easypayPaymentApprovalResultSchema, approvalResult);
  }
}
