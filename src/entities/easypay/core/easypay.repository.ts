import {
  EasyPayRegisterTransactionRequestDto,
  EasyPayApprovePaymentRequestDto,
  EasyPayPaymentCancelRequestDto,
} from '../dto';
import {
  EasyPayRegisterTransactionResult,
  EasyPayPaymentApprovalResult,
  EasyPayPaymentCancelResult,
} from '../types';

export interface EasyPayRepository {
  registerTransaction: (
    dto: EasyPayRegisterTransactionRequestDto,
  ) => Promise<EasyPayRegisterTransactionResult>;
  approvePayment: (dto: EasyPayApprovePaymentRequestDto) => Promise<EasyPayPaymentApprovalResult>;
  partialCancel: (dto: EasyPayPaymentCancelRequestDto) => Promise<EasyPayPaymentCancelResult>;
  totalCancel: (dto: EasyPayPaymentCancelRequestDto) => Promise<EasyPayPaymentCancelResult>;
}
