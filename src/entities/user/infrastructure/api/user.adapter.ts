import { headers as nextHeaders } from 'next/headers';
import { FindOption, LoggerV2 } from '@/shared';
import {
  getTransactionContextFromStore,
  PayloadCms,
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
  PayloadAdapterResult,
} from '@/shared/server';
import { UpdateUserDto } from '../../dto';
import { UserError } from '../../libs';
import { USER_ERROR_MESSAGE } from '../../constants';

export const UserAdapter = () => ({
  getUserByHeader: async (): Promise<PayloadAdapterResult> => {
    try {
      const payload = await PayloadCms.getInstance();
      const nextHeader = await nextHeaders();
      const { user } = await payload.auth({ headers: nextHeader, canSetHeaders: false });

      if (user === null) {
        return PayloadAdapterResultManager.fail(UserError.notFound());
      }
      return PayloadAdapterResultManager.ok(user);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, USER_ERROR_MESSAGE.notFound);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getUserById: async (id: number) => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const user = await payload.findByID({
        collection: 'users',
        depth: 0,
        id,
        req,
      });
      return PayloadAdapterResultManager.ok(user);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, USER_ERROR_MESSAGE.notFound);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  updateUser: async (dto: UpdateUserDto) => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const user = await payload.update({
        collection: 'users',
        id: dto.user,
        data: dto.data,
        req,
      });
      return PayloadAdapterResultManager.ok(user);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, USER_ERROR_MESSAGE.updateFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },

  getUserList: async (option: FindOption) => {
    try {
      const payload = await PayloadCms.getInstance();
      const req = getTransactionContextFromStore();
      const { docs } = await payload.find({
        collection: 'users',
        depth: 0,
        req,
        ...option,
      });
      return PayloadAdapterResultManager.ok(docs);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, USER_ERROR_MESSAGE.fetchFail);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
