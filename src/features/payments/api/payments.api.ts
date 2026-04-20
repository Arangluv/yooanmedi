'use server';

import { EndPointResult, failure, ok } from '@/shared/lib/end-point-result';
import { normalizeError } from '@/shared/model/errors/normalize-error';
import { Logger } from '@/shared/model/logger/logger';
import { BankTransferPaymentCommand } from '../model/command/bank-transfer-payment-command';
import { PaymentRequestDto } from '../model/schema/payments-request.schema';

export const paymentBybankTransfer = async (
  requestDto: PaymentRequestDto,
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
