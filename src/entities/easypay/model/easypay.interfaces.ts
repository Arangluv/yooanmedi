import {
  type EasypayRegisterTransactionResponseDto,
  type RegisterTransactionRequestDto,
} from './schemas/easypay.transaction-register.schema';

export interface IEasyPay {
  registerTransaction: (
    dto: RegisterTransactionRequestDto,
  ) => Promise<EasypayRegisterTransactionResponseDto>;
  approveTransaction: (dto: any) => Promise<void>;
  cancelTransaction: (dto: any) => Promise<void>;
}
