'use server';

import { EndPointResult, EndPointResultManager, FindOption, LoggerV2 } from '@/shared';
import { ModifyPasswordDto } from '../types';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { ModifyPasswordMapper } from '../mapper';
import { verifyPassword } from '../libs';

export type ModifyPasswordApiResponse = EndPointResult;

export const modifyPasswordApi = async (dto: ModifyPasswordDto) => {
  try {
    const userRepository = new UserApiRepository(UserAdapter());
    const user = await userRepository.findWithHiddenField(dto.user);
    const isPasswordMatch = await verifyPassword(dto.currentPassword, user.salt, user.hash);

    if (!isPasswordMatch) {
      return EndPointResultManager.fail('현재 비밀번호가 올바르지 않습니다');
    }

    const updateUserDto = ModifyPasswordMapper.dtoToUpdateUserDto(dto);
    await userRepository.update(updateUserDto);
    return EndPointResultManager.ok('비밀번호가 변경되었습니다');
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('비밀번호를 변경하는데 문제가 발생했습니다');
  }
};
