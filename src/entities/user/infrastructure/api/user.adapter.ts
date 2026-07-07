import { headers as nextHeaders } from 'next/headers';
import { FindOption, LoggerV2 } from '@/shared';
import {
  getTransactionContextFromStore,
  PayloadCmsErrorTranslator,
  PayloadAdapterResultManager,
  getPayload,
} from '@/shared/server';
import {
  CreateUserResponse,
  GetUserByHeaderResponse,
  GetUserByIdResponse,
  GetUserListResponse,
  UpdateUserResponse,
} from '../../types';
import { CreateClientRequestDto, UpdateUserDto } from '../../dto';
import { UserError } from '../../libs';
import { USER_ERROR_MESSAGE } from '../../constants';

export const UserAdapter = () => ({
  getUserByHeader: async (): Promise<GetUserByHeaderResponse> => {
    try {
      const payload = await getPayload();
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

  getUserById: async (id: number): Promise<GetUserByIdResponse> => {
    try {
      const payload = await getPayload();
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

  getUserList: async (option: FindOption): Promise<GetUserListResponse> => {
    try {
      const payload = await getPayload();
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

  updateUser: async (dto: UpdateUserDto): Promise<UpdateUserResponse> => {
    try {
      const payload = await getPayload();
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

  createUser: async (dto: CreateClientRequestDto): Promise<CreateUserResponse> => {
    try {
      const payload = await getPayload();
      const req = getTransactionContextFromStore();
      const user = await payload.create({
        collection: 'users',
        data: dto,
        req,
      });
      return PayloadAdapterResultManager.ok(user);
    } catch (error) {
      LoggerV2.error(error);
      const baseError = PayloadCmsErrorTranslator.toBaseError(error, USER_ERROR_MESSAGE.create);
      return PayloadAdapterResultManager.fail(baseError);
    }
  },
});
