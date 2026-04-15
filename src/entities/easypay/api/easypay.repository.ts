import { zodSafeParse } from '@/shared/lib/zod';
import {
  EasypayRegisterTransactionRequestDto,
  EasypayRegisterTransactionResponseDto,
  easypayRegisterTransactionResponseSchema,
} from '../model/schemas/easypay.transaction-register.schema';
import { registerTransaction as registerTransactionApi } from './register-transaction';

export class EasyPayRepository {
  public static async registerTransaction(
    dto: EasypayRegisterTransactionRequestDto,
  ): Promise<EasypayRegisterTransactionResponseDto> {
    const result = await registerTransactionApi(dto);
    return zodSafeParse(easypayRegisterTransactionResponseSchema, result);
  }
}
