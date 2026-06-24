'use server';

import { logout as payloadLogout } from '@payloadcms/next/auth';
import { EndPointResult, EndPointResultManager, LoggerV2, BaseErrorManager } from '@/shared';
import { payloadConfig } from '@/shared/server';
import { UserAdapter, UserApiRepository } from '../infrastructure';
import { User } from '../types';
import { USER_ERROR_MESSAGE } from '../constants';

export const getUserByHeader = async (): Promise<EndPointResult<User>> => {
  try {
    const userApiRepository = new UserApiRepository(UserAdapter());
    const user = await userApiRepository.findByHeader();
    return EndPointResultManager.okWithData({ data: user });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? USER_ERROR_MESSAGE.notFound);
  }
};

export const logout = async (): Promise<EndPointResult> => {
  try {
    const res = await payloadLogout({ config: payloadConfig });
    if (res.success) {
      return EndPointResultManager.ok();
    } else {
      return EndPointResultManager.fail('로그아웃하는데 문제가 발생했습니다');
    }
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '로그아웃하는데 문제가 발생했습니다');
  }
};
