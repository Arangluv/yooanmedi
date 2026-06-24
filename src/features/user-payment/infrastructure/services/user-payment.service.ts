import { BaseError, LoggerV2 } from '@/shared';
import { PaymentCommandFactory } from '../command';
import { UserPaymentsUseCase } from '../../usecases';
import { PGPaymentRequestDto, BankTransferPaymentRequestDto } from '../../dto';
import { UserPaymentError } from '../../core';

export const UserPaymentService = (): UserPaymentsUseCase => ({
  payByPg: async (dto: PGPaymentRequestDto) => {
    try {
      const command = await PaymentCommandFactory.createCommandForPG(dto);
      return await command.execute();
    } catch (error) {
      LoggerV2.error(error);

      if (error instanceof BaseError) {
        throw error;
      }

      throw UserPaymentError.paymentFail();
    }
  },

  payByBankTransfer: async (dto: BankTransferPaymentRequestDto) => {
    try {
      const command = await PaymentCommandFactory.createCommandForBankTransfer(dto);
      return await command.execute();
    } catch (error) {
      LoggerV2.error(error);

      if (error instanceof BaseError) {
        throw error;
      }

      throw UserPaymentError.paymentFail();
    }
  },
});
