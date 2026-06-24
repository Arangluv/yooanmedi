import { BaseError } from '@/shared';

export class OrderListError extends BaseError {
  static getListFail(message: string) {
    return new OrderListError({
      clientMsg: message,
      errorName: 'OrderListErrror',
    });
  }
}
