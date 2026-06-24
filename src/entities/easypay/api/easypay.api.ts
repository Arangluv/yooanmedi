'use server';

import { EasyPayAdapter, EasyPayApiRepository } from '../infrastructure';
import { EasyPayRegisterTransactionRequestDto } from '../dto';
import { BaseErrorManager, EndPointResultManager, LoggerV2 } from '@/shared';

export const registerTransactionApi = async (dto: EasyPayRegisterTransactionRequestDto) => {
  try {
    const easyPayRepository = new EasyPayApiRepository(EasyPayAdapter());
    const result = await easyPayRepository.registerTransaction(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '결제창을 불러오는데 문제가 발생했습니다');
  }
};
