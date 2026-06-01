import { FindOption } from '@/shared';
import {
  getTransactionContextFromStore,
  PayloadCms,
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
  PayloadAdapterResult,
} from '@/shared/server';
import { CreatePointTransactionEntity } from '../../types';
import { LoggerV2 } from '@/shared';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../../constants';

export const PointTransactionAdapter = () => ({
  create: async (entity: CreatePointTransactionEntity): Promise<PayloadAdapterResult> => {
    try {
      const payload = await PayloadCms.getInstance();
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

  findOne: async (option: FindOption): Promise<PayloadAdapterResult> => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const { docs } = await payload.find({
        collection: 'point-transaction',
        ...option,
        limit: 1,
        req,
      });

      return PayloadAdapterResultManager.ok(docs[0]);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(
        error,
        POINT_TRANSACTION_ERROR_MESSAGE.findUser,
      );
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
