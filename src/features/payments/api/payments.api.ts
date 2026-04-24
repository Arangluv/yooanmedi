'use server';

import { EndPointResult, failure, ok, normalizeError } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { BankTransferPaymentCommand } from '../model/command/bank-transfer-payment-command';
import { BankTransferRequestDto } from '../model/schemas/bank-transfer-request.schema';

export const paymentBybankTransfer = async (
  requestDto: BankTransferRequestDto,
): Promise<EndPointResult> => {
  try {
    const command = new BankTransferPaymentCommand(requestDto);
    await command.execute();
    return ok('무통장 입금 주문을 생성하였습니다.');
  } catch (error) {
    const normalizedError = normalizeError(error);
    Logger.error(error);
    return failure(normalizedError.message);
  }
};
