import {
  type EasypayRegisterTransactionResponseDto,
  type RegisterTransactionRequestDto,
} from './schemas/easypay.register-transaction.schema';
import {
  type EasypayRegisterTransactionRawResult,
  type EasypayRegisterTransactionValidatedResult,
} from './schemas/easypay.register-transaction-result.schema';
import {
  type EasypayPaymentApprovalRequestDto,
  type EasypayPaymentApprovalResult,
} from './schemas/easypay.payment-approval.schema';

export interface IEasyPay {
  registerTransaction: (
    dto: RegisterTransactionRequestDto,
  ) => Promise<EasypayRegisterTransactionResponseDto>;
  validateAndParseRegisterTransactionResult: (
    registerDto: EasypayRegisterTransactionRawResult,
  ) => EasypayRegisterTransactionValidatedResult;
  approvePayment: (dto: EasypayPaymentApprovalRequestDto) => Promise<EasypayPaymentApprovalResult>;
  cancelTransaction: (dto: any) => Promise<void>;
}
