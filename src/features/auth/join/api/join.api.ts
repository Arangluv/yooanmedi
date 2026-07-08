'use server';

import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { CreateClientRequestDto, User } from '@/entities/user';
import { createJoinUsecase } from '../infrastructure';
import { JoinUniqueCheckFieldDto } from '../types';

export type ClientJoinApiResponse = EndPointResult<User>;

export const clientJoinApi = async (
  dto: CreateClientRequestDto,
): Promise<ClientJoinApiResponse> => {
  try {
    const { clientJoin } = createJoinUsecase();
    const user = await clientJoin(dto);
    return EndPointResultManager.okWithData({ data: user, message: '회원가입을 요청했습니다.' });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('회원가입을 하는데 문제가 발생했습니다');
  }
};

export const checkDuplicateJoinFieldApi = async (data: JoinUniqueCheckFieldDto[]) => {
  try {
    const { checkDuplicateFileds } = createJoinUsecase();
    const result = await checkDuplicateFileds(data);

    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('회원가입을 하는데 문제가 발생했습니다');
  }
};
