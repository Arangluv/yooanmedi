import { LoggerV2, FindOption } from '@/shared';
import {
  getTransactionContextFromStore,
  getPayload,
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
} from '@/shared/server';
import {
  CreatePointHistoryEntity,
  CreatePointHistoryResponse,
  GetPointHistoryResponse,
} from '../../types';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../../constants';
import { PointHistoryError } from '../../libs';

export const PointHistoryAdapter = () => ({
  create: async (entity: CreatePointHistoryEntity): Promise<CreatePointHistoryResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const result = await payload.create({
        collection: 'point-transaction',
        data: entity,
        depth: 0,
        req,
      });

      return PayloadAdapterResultManager.ok(result);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        POINT_TRANSACTION_ERROR_MESSAGE.create,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  findOne: async (option: FindOption): Promise<GetPointHistoryResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const { docs: pointTransaction } = await payload.find({
        collection: 'point-transaction',
        ...option,
        depth: 0,
        limit: 1,
        req,
      });

      if (pointTransaction.length > 1) {
        const error = PointHistoryError.invalidFindOption(option);
        throw error;
      }

      return PayloadAdapterResultManager.ok(pointTransaction[0]);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        POINT_TRANSACTION_ERROR_MESSAGE.fetchFail,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
