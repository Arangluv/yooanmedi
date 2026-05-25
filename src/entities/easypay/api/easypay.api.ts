'use server';

import { EndPointResult, failure, okWithData } from '@/shared';
import { normalizeError } from '@/shared';
import { Logger } from '@/shared';
import { EasyPayService } from '../model/easypay.service';
import { type RegisterTransactionRequestDto } from '../model/schemas/easypay.register-transaction.schema';

export interface RegisterTransactionResponse {
  authPageUrl: string;
}

export const registerTransaction = async (
  dto: RegisterTransactionRequestDto,
): Promise<EndPointResult<RegisterTransactionResponse>> => {
  try {
    const easypayService = new EasyPayService();
    const result = await easypayService.registerTransaction(dto);

    return okWithData({
      data: {
        authPageUrl: result.authPageUrl,
      },
    });
  } catch (error) {
    const normalizedError = normalizeError(error);
    Logger.error(error);

    return failure(normalizedError.message);
  }
};
