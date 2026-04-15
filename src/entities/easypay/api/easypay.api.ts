'use server';

import { EndPointResult, failure, ok } from '@/shared/lib/end-point-result';
import { normalizeError } from '@/shared/model/errors/normalize-error';
import { Logger } from '@/shared/model/logger/logger';
import { EasyPayService } from '../model/easypay.service';
import { type RegisterTransactionRequestDto } from '../model/schemas/easypay.register-transaction.schema';

export interface RegisterTransactionResponseDto {
  authPageUrl: string;
}

export const registerTransaction = async (
  dto: RegisterTransactionRequestDto,
): Promise<EndPointResult<RegisterTransactionResponseDto>> => {
  try {
    const easypayService = new EasyPayService();
    const result = await easypayService.registerTransaction(dto);

    return ok(result);
  } catch (error) {
    const normalizedError = normalizeError(error);
    Logger.error(error);

    return failure(normalizedError.message);
  }
};
