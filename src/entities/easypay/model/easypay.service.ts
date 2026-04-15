import { IEasyPay } from './easypay.interfaces';
import { EasyPayRepository } from '../api/easypay.repository';
import {
  easypayRegisterTransactionSchema,
  type RegisterTransactionRequestDto,
} from './schemas/easypay.transaction-register.schema';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';
import { zodSafeParse } from '@/shared/lib/zod';

export class EasyPayService implements IEasyPay {
  public async registerTransaction(requestDto: RegisterTransactionRequestDto) {
    const easypayRegisterTransactionDto = zodSafeParse(
      easypayRegisterTransactionSchema,
      requestDto,
    );
    const result = await EasyPayRepository.registerTransaction(easypayRegisterTransactionDto);

    if (!result.isSuccess) {
      const error = new BusinessLogicError('결제등록 과정에서 문제가 발생했습니다');
      error.setDevMessage(`resCd: ${result.resCd}, resMsg: ${result.resMsg}`);
      throw error;
    }

    return result;
  }

  public async approveTransaction(dto: any): Promise<void> {
    throw 'not implemented';
  }

  public async cancelTransaction(dto: any): Promise<void> {
    throw 'not implemented';
  }
}
