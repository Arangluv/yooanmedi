import { FindOption, LoggerV2 } from '@/shared';
import {
  getTransactionContextFromStore,
  PayloadAdapterResultManager,
  getPayload,
  PayloadCmsErrorTranslator,
} from '@/shared/server';
import { PURCHASED_HISTORY_ERROR_MESSAGE } from '../../constants';
import { CreatePurchasedHistoryRequestDto } from '../../dto';
import { CreatePurchasedHistoriesResponse, GetPurchasedHistoriesResponse } from '../../types';

export const PurchasedHistoryAdapter = () => ({
  createPurchasedHistory: async (
    dto: CreatePurchasedHistoryRequestDto,
  ): Promise<CreatePurchasedHistoriesResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const history = await payload.create({
        collection: 'recent-purchased-history',
        data: dto,
        depth: 0,
        req,
      });
      return PayloadAdapterResultManager.ok(history);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PURCHASED_HISTORY_ERROR_MESSAGE.create,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getPurchasedHistories: async (option: FindOption): Promise<GetPurchasedHistoriesResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const { docs: histories } = await payload.find({
        collection: 'recent-purchased-history',
        ...option,
        depth: 0,
        req,
      });
      return PayloadAdapterResultManager.ok(histories);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        PURCHASED_HISTORY_ERROR_MESSAGE.fetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
