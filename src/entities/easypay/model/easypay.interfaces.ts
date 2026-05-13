import {
  type EasypayRegisterTransactionSuccessResult,
  type RegisterTransactionRequestDto,
} from './schemas/easypay.register-transaction.schema';
import {
  type EasypayRegisterTransactionResponse,
  type RegisterTransactionResult,
} from './schemas/easypay.register-transaction-result.schema';
import {
  type PaymentApprovalRequestDto,
  type PaymentApprovalSuccessResult,
  type paymentApprovalFailureResult,
} from './schemas/easypay.payment-approval.schema';
import { EasypayCancelRequestDto } from './schemas/easypay.cancel.schema';

export interface IEasyPay {
  registerTransaction: (
    dto: RegisterTransactionRequestDto,
  ) => Promise<EasypayRegisterTransactionSuccessResult>;
  validateAndParseRegisterTransactionResult: (
    registerDto: EasypayRegisterTransactionResponse,
  ) => RegisterTransactionResult;
  approvePayment: (
    dto: PaymentApprovalRequestDto,
  ) => Promise<PaymentApprovalSuccessResult | paymentApprovalFailureResult>;
  partialCancelRequest: (dto: EasypayCancelRequestDto) => Promise<void>;
  totalCancelRequest: (dto: EasypayCancelRequestDto) => Promise<void>;
}
