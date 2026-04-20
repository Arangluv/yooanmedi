'use server';

import { EndPointResult, failure, ok } from '@/shared/lib/end-point-result';
import { normalizeError } from '@/shared/model/errors/normalize-error';
import { Logger } from '@/shared/model/logger/logger';
import { BankTransferPaymentCommand } from '../model/command/bank-transfer-payment-command';
import { BankTransferPaymentInitContext } from '../model/schema/payment-context-schema';
import { BankTransferRequestDto } from '../model/schema/banktransfer-request.schema';

export const paymentBybankTransfer = async (
  requestDto: BankTransferRequestDto,
): Promise<EndPointResult> => {
  try {
    const context = BankTransferPaymentCommand.createContext(requestDto);
    const command: BankTransferPaymentCommand<BankTransferPaymentInitContext> =
      await BankTransferPaymentCommand.create(context);
    await command.execute();

    // const command: BankTransferPaymentCommand<BankTransferPaymentInitContext> =
    //   await BankTransferPaymentCommand.create(requestDto); <-- 이상적인 추상화 형태
    // await command.execute();

    return ok('무통장 입금 주문을 생성하였습니다.');
  } catch (error) {
    const normalizedError = normalizeError(error);
    Logger.error(error);
    return failure(normalizedError.message);
  }
};
