import { IEasyPay } from './easypay.interfaces';
import { EasyPayRepository } from '../api/easypay.repository';
import {
  toRegisterTransactionServiceDto,
  type RegisterTransactionRequestDto,
} from './schemas/easypay.register-transaction.schema';
import {
  toTransactionRegistrationServiceResult,
  type EasypayRegisterTransactionResponse,
} from './schemas/easypay.register-transaction-result.schema';
import {
  type PaymentApprovalRequestDto,
  toPaymentApprovalServiceDto,
} from './schemas/easypay.payment-approval.schema';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';

export class EasyPayService implements IEasyPay {
  public async registerTransaction(requestDto: RegisterTransactionRequestDto) {
    const easypayRegisterTransactionDto = toRegisterTransactionServiceDto(requestDto);
    const result = await EasyPayRepository.registerTransaction(easypayRegisterTransactionDto);

    if (!result.isRegistrationSuccess) {
      const error = new BusinessLogicError('결제등록 과정에서 문제가 발생했습니다');
      error.setDevMessage(`resCd: ${result.resCd}, resMsg: ${result.resMsg}`);
      throw error;
    }

    return result;
  }

  public validateAndParseRegisterTransactionResult(
    registerDto: EasypayRegisterTransactionResponse,
  ) {
    const registerResult = toTransactionRegistrationServiceResult(registerDto);

    if (!registerResult.isRegistrationSuccess) {
      const error = new BusinessLogicError('결제등록 과정에서 문제가 발생했습니다');
      error.setDevMessage(`resCd: ${registerResult.resCd}, resMsg: ${registerResult.resMsg}`);
      throw error;
    }

    return registerResult;
  }

  public async approvePayment(dto: PaymentApprovalRequestDto) {
    const easypayRequestDto = toPaymentApprovalServiceDto(dto);
    const approvalResult = await EasyPayRepository.approvePayment(easypayRequestDto);

    if (!approvalResult.isPaymentApprovalSuccess) {
      const error = new BusinessLogicError('결제승인 과정에서 문제가 발생했습니다');
      error.setDevMessage(`resCd: ${approvalResult.resCd}, resMsg: ${approvalResult.resMsg}`);
      throw error;
    }

    return approvalResult;
  }
}
