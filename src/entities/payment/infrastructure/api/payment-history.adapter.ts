import { LoggerV2 } from '@/shared';
import {
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
  getPayload,
  getTransactionContextFromStore,
} from '@/shared/server';
import { CreatePaymentHistorRequestyDto } from '../../dto';
import { PAYMENT_HISTORY_ERROR_MESSAGE } from '../../constant';
import { PaymentHistoryError } from '../../libs';

export const PaymentHistoryAdapter = () => ({
  createPaymentHistory: async (dto: CreatePaymentHistorRequestyDto) => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const history = await payload.create({
        collection: 'payment',
        data: dto,
        depth: 0,
        req,
      });
      return PayloadAdapterResultManager.ok(history);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PAYMENT_HISTORY_ERROR_MESSAGE.create,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getPaymentHistoryByOrderId: async (orderId: number) => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const { docs: history } = await payload.find({
        collection: 'payment',
        depth: 0,
        where: {
          order: {
            equals: orderId,
          },
        },
        req,
      });

      if (history.length > 1) {
        const error = PaymentHistoryError.invalidFindOption();
        return PayloadAdapterResultManager.fail(error);
      }

      return PayloadAdapterResultManager.ok(history[0]);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PAYMENT_HISTORY_ERROR_MESSAGE.fetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
