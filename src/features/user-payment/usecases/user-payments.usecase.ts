import {
  PGPaymentRequestDto,
  BankTransferPaymentRequestDto,
  PGPaymentCommandResult,
  BankTransferPaymentCommandResult,
} from '../dto';

export interface UserPaymentsUseCase {
  payByPg: (dto: PGPaymentRequestDto) => Promise<PGPaymentCommandResult>;
  payByBankTransfer: (
    dto: BankTransferPaymentRequestDto,
  ) => Promise<BankTransferPaymentCommandResult>;
}
