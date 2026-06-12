import { BaseError } from '@/shared';

export const PAYMENT_ERROR_MESSAGE = {
  paymentFail: '결제를 처리하는데 문제가 발생했습니다',
  createOrder: '주문을 생성하는데 문제가 발생했습니다',
  createOrderProduct: '주문상품을 생성하는데 문제가 발생했습니다',
  createPurchasedHistory: '구매내역을 생성하는데 문제가 발생했습니다',
  createUsePointHistory: '포인트 사용내역을 생성하는데 문제가 발생했습니다',
  createPaymentHistory: '결제내역을 생성하는데 문제가 발생했습니다',
  subtractUserPoint: '사용포인트 차감을 하는 과정에서 문제가 발생했습니다',
  approvePayment: '결제승인 요청을 하는 과정에서 문제가 발생했습니다',
};

export class PaymentError extends BaseError {
  static paymentFail(message: string = PAYMENT_ERROR_MESSAGE.paymentFail) {
    return new PaymentError({
      clientMsg: message,
      errorName: 'PaymentCommandError',
    });
  }

  static createOrderFail() {
    return new PaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.createOrder,
      errorName: 'PaymentCommandError',
    });
  }

  static createOrderProductFail() {
    return new PaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.createOrderProduct,
      errorName: 'PaymentCommandError',
    });
  }

  static createPurchasedHistory() {
    return new PaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.createPurchasedHistory,
      errorName: 'PaymentCommandError',
    });
  }

  static createUsePointHistory() {
    return new PaymentError({
      clientMsg: PAYMENT_ERROR_MESSAGE.subtractUserPoint,
      errorName: 'PaymentCommandError',
    });
  }
}
