import { BaseError } from '@/shared';

export const EASYPAY_ERROR_MESSAGE = {
  network: '이지페이 결제 모듈 연결에 문제가 발생했습니다',
  register: '결제등록을 하는 과정에서 문제가 발생했습니다',
  approve: '결제승인을 요청하는 과정에서 문제가 발생했습니다',
  cancel: '결제취소 요청하는 과정에서 문제가 발생했습니다',
};

export class EasyPayError extends BaseError {
  static networkError() {
    return new EasyPayError({
      clientMsg: EASYPAY_ERROR_MESSAGE.network,
      errorName: 'EasyPayFetchError',
    });
  }

  static registerFail(message: string = EASYPAY_ERROR_MESSAGE.register) {
    return new EasyPayError({
      clientMsg: message,
      errorName: 'EasyPayRegisterError',
    });
  }

  static approveFail(message: string = EASYPAY_ERROR_MESSAGE.approve) {
    return new EasyPayError({
      clientMsg: message,
      errorName: 'EasyPayApprovePaymentError',
    });
  }

  static cancelFail(message: string = EASYPAY_ERROR_MESSAGE.cancel) {
    return new EasyPayError({
      clientMsg: message,
      errorName: 'EasyPayCancelPaymentError',
    });
  }
}
