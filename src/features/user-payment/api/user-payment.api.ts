'use server';

import { BaseErrorManager, EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import {
  BankTransferPaymentRequestDto,
  PGPaymentRequestDto,
  PGPaymentCommandResult,
  BankTransferPaymentCommandResult,
} from '../dto';
import { createUserPaymentUsecase } from '../infrastructure';

export type PayByPgResponse = EndPointResult<PGPaymentCommandResult>;

export const payByPgApi = async (dto: PGPaymentRequestDto): Promise<PayByPgResponse> => {
  try {
    const { payByPg } = createUserPaymentUsecase();
    const result = await payByPg(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '무통장 입금 결제요청에 실패했습니다');
  }
};

export type PayByBankTransferResponse = EndPointResult<BankTransferPaymentCommandResult>;

export const payByBankTransferApi = async (
  dto: BankTransferPaymentRequestDto,
): Promise<PayByBankTransferResponse> => {
  try {
    const { payByBankTransfer } = createUserPaymentUsecase();
    await payByBankTransfer(dto);
    return EndPointResultManager.ok();
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '무통장 입금 결제요청에 실패했습니다');
  }
};
