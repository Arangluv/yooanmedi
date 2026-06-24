import { BaseError } from '@/shared';
import { Order } from '@/entities/order';
import { PGTotalCancelCommand } from './pg';
import { BankTransferTotalCancelCommand } from './bank-transfer';
import { CancelOrderServiceDependencies } from '../../core';

export class AdminOrderTotalCancelCommandFactory {
  public static createCommand({
    order,
    dependencies,
  }: {
    order: Order;
    dependencies: CancelOrderServiceDependencies;
  }) {
    switch (order.paymentsMethod) {
      case 'creditCard':
        return new PGTotalCancelCommand(dependencies, { order });
      case 'bankTransfer':
        return new BankTransferTotalCancelCommand(dependencies, { order });
      default:
        throw new BaseError({
          clientMsg: '결제취소를 처리하는 과정에서 문제가 발생했습니다',
          devMsg: `잘못된 order 데이터입니다. ${order}`,
          errorName: 'CancelOrderError',
        });
    }
  }
}
