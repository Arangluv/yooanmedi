import { BaseError } from '@/shared';

export const PAYMENT_ERROR_MESSAGE = {
  createContext: '결제 컨텍스트를 생성하는데 문제가 발생했습니다',
  paymentFail: '결제를 처리하는데 문제가 발생했습니다',
  createOrder: '주문을 생성하는데 문제가 발생했습니다',
  createOrderProduct: '주문상품을 생성하는데 문제가 발생했습니다',
  createPurchasedHistory: '구매내역을 생성하는데 문제가 발생했습니다',
  createUsePointHistory: '포인트 사용내역을 생성하는데 문제가 발생했습니다',
  createPaymentHistory: '결제내역을 생성하는데 문제가 발생했습니다',
  subtractUserPoint: '사용포인트 차감을 하는 과정에서 문제가 발생했습니다',
  approvePayment: '결제승인 요청을 하는 과정에서 문제가 발생했습니다',
};

export class UserPaymentError extends BaseError {
  static paymentFail(message: string = PAYMENT_ERROR_MESSAGE.paymentFail) {
    return new UserPaymentError({
      clientMsg: message,
      errorName: 'UserPaymentCommandError',
    });
  }

  static createOrderFail() {
    return new UserPaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.createOrder,
      errorName: 'UserPaymentCommandError',
    });
  }

  static createOrderProductFail() {
    return new UserPaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.createOrderProduct,
      errorName: 'UserPaymentCommandError',
    });
  }

  static createPurchasedHistory() {
    return new UserPaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.createPurchasedHistory,
      errorName: 'UserPaymentCommandError',
    });
  }

  static createUsePointHistory() {
    return new UserPaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.subtractUserPoint,
      errorName: 'UserPaymentCommandError',
    });
  }
}
