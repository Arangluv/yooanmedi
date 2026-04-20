'use server';

import { EndPointResult, failure, ok } from '@/shared/lib/end-point-result';
import { normalizeError } from '@/shared/model/errors/normalize-error';
import { Logger } from '@/shared/model/logger/logger';
import { BankTransferPaymentManager } from '../model/manager/bank-transfer-payment-manager';
import { BankTransferPaymentInitContext } from '../model/schema/payment-context-schema';
import { BankTransferRequestDto } from '../model/schema/banktransfer-request.schema';

export const paymentBybankTransfer = async (
  requestDto: BankTransferRequestDto,
): Promise<EndPointResult> => {
  try {
    const context = BankTransferPaymentManager.createContext(requestDto);
    const manager: BankTransferPaymentManager<BankTransferPaymentInitContext> =
      await BankTransferPaymentManager.create(context);
    await manager.execute();

    return ok('무통장 입금 주문을 생성하였습니다.');
  } catch (error) {
    const normalizedError = normalizeError(error);
    Logger.error(error);
    return failure(normalizedError.message);
  }
};
