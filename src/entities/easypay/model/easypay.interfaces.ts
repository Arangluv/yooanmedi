import {
  type EasypayRegisterTransactionResponseDto,
  type RegisterTransactionRequestDto,
} from './schemas/easypay.register-transaction.schema';
import {
  type EasypayRegisterTransactionRawResult,
  type EasypayRegisterTransactionValidatedResult,
} from './schemas/easypay.register-transaction-result.schema';

export interface IEasyPay {
  registerTransaction: (
    dto: RegisterTransactionRequestDto,
  ) => Promise<EasypayRegisterTransactionResponseDto>;
  validateAndParseRegisterTransactionResult: (
    registerDto: EasypayRegisterTransactionRawResult,
  ) => EasypayRegisterTransactionValidatedResult;
  approveTransaction: (dto: any) => Promise<void>;
  cancelTransaction: (dto: any) => Promise<void>;
}
