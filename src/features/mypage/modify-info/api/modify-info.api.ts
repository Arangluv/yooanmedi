'use server';

import { UpdateUserDto, User } from '@/entities/user';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';

export type ModifyUserInfoApiResponse = EndPointResult<User>;

export const modifyUserInfoApi = async (dto: UpdateUserDto) => {
  try {
    const userRepository = new UserApiRepository(UserAdapter());
    const updatedUser = await userRepository.update(dto);
    return EndPointResultManager.okWithData({
      data: updatedUser,
      message: '회원정보 수정을 완료했습니다',
    });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('회원정보를 수정하는데 문제가 발생했습니다');
  }
};
