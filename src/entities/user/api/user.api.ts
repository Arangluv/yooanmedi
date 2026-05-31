'use server';

import { logout as payloadLogout } from '@payloadcms/next/auth';
import { EndPointResult, okWithData, failure, ok, LoggerV2, BaseErrorManager } from '@/shared';
import { payloadConfig } from '@/shared/server';
import { UserAdapter, UserApiRepository } from '../infrastructure';
import { User } from '../types';
import { USER_ERROR_MESSAGE } from '../constants';

export const getUserByHeader = async (): Promise<EndPointResult<User>> => {
  try {
    const userApiRepository = new UserApiRepository(UserAdapter());
    const user = await userApiRepository.findByHeader();
    return okWithData({ data: user });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return failure(message ?? USER_ERROR_MESSAGE.notFound);
  }
};

export const logout = async (): Promise<EndPointResult> => {
  try {
    const res = await payloadLogout({ config: payloadConfig });
    if (res.success) {
      return ok();
    } else {
      return failure('로그아웃하는데 문제가 발생했습니다');
    }
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return failure(message ?? '로그아웃하는데 문제가 발생했습니다');
  }
};
