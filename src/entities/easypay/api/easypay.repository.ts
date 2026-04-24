import {
  toRegisterTransactionResult,
  type RegisterTransactionServiceDto,
  type RegisterTransactionResult,
} from '../model/schemas/easypay.register-transaction.schema';
import {
  toPaymentApprovalResult,
  type PaymentApprovalServiceDto,
} from '../model/schemas/easypay.payment-approval.schema';
import { registerTransaction as registerTransactionApi } from './register-transaction';
import { approvePayment } from './approve-payment';

export class EasyPayRepository {
  public static async registerTransaction(
    dto: RegisterTransactionServiceDto,
  ): Promise<RegisterTransactionResult> {
    const result = await registerTransactionApi(dto);
    return toRegisterTransactionResult(result);
  }

  public static async approvePayment(dto: PaymentApprovalServiceDto) {
    const approvalResult = await approvePayment(dto);
    return toPaymentApprovalResult(approvalResult);
  }
}
