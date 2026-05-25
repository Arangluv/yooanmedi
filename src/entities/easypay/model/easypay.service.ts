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
import { BusinessLogicError } from '@/shared';
import {
  EasypayCancelRequestDto,
  toEasypayPartialCancelEntity,
  toEasypayTotalCancelEntity,
} from './schemas/easypay.cancel.schema';
import { EASYPAY_CONFIG, zodSafeParse } from '@/shared';

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

  public async partialCancelRequest(dto: EasypayCancelRequestDto) {
    try {
      const requestEntity = toEasypayPartialCancelEntity(dto);
      const result = await EasyPayRepository.paymentCancel(requestEntity);

      if (result.resCd !== EASYPAY_CONFIG.successResponseCode) {
        const error = new BusinessLogicError('주문을 취소하는데 문제가 발생했습니다');
        error.setDevMessage(`이지페이 결제취소 요청이 반려되었습니다 - ${result.resMsg}`);
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  public async totalCancelRequest(dto: EasypayCancelRequestDto) {
    try {
      const requestEntity = toEasypayTotalCancelEntity(dto);
      const result = await EasyPayRepository.paymentCancel(requestEntity);

      if (result.resCd !== EASYPAY_CONFIG.successResponseCode) {
        const error = new BusinessLogicError('주문을 취소하는데 문제가 발생했습니다');
        error.setDevMessage(`이지페이 결제취소 요청이 반려되었습니다 - ${result.resMsg}`);
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
