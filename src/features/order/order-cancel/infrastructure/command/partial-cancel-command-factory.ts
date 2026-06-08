import { BusinessLogicError, PAYMENTS_METHOD } from '@/shared';
import { Order, ORDER_STATUS } from '@/entities/order';
import {
  AdminBankTransferPartialCancel,
  BankTransferPartialCancelImmediateCommand,
  BankTransferPartialCancelRequestCommand,
} from './bank-transfer';
import { PGPartialCancelCommand } from './pg';
import { IPartialCancelCommand } from '../../core';

const partialCancelStrategy = {
  pg: 'pg',
  banktransfer_immediate: 'banktransfer_immediate',
  banktransfer_cancel_request: 'banktransfer_cancel_request',
} as const;

export type ClientPartialOrderCancelStrategy =
  | 'pg'
  | 'banktransfer_immediate'
  | 'banktransfer_cancel_request';

export interface ClientPartialOrderCancelCommandRequest {
  strategy: ClientPartialOrderCancelStrategy;
  order: Order;
  orderProductId: number;
}

export class ClientPartialOrderCancelCommandFactory {
  public static createCommand(dto: ClientPartialOrderCancelCommandRequest): IPartialCancelCommand {
    switch (dto.strategy) {
      case partialCancelStrategy.pg:
        return new PGPartialCancelCommand(dto.order, dto.orderProductId);
      case partialCancelStrategy.banktransfer_immediate:
        return new BankTransferPartialCancelImmediateCommand(dto.order, dto.orderProductId);
      case partialCancelStrategy.banktransfer_cancel_request:
        return new BankTransferPartialCancelRequestCommand(dto.order, dto.orderProductId);
      default:
        const error = new BusinessLogicError('주문상품을 취소하는데 문제가 발생했습니다');
        error.setDevMessage('올바르지 않은 취소 strategy 입니다');
        throw error;
    }
  }

  public static getCancelStrategy(order: Order): ClientPartialOrderCancelStrategy {
    if (order.paymentsMethod === PAYMENTS_METHOD.credit_card && ORDER_STATUS.preparing) {
      return partialCancelStrategy.pg;
    }

    if (
      order.paymentsMethod === PAYMENTS_METHOD.bank_transfer &&
      order.orderStatus === ORDER_STATUS.pending
    ) {
      return partialCancelStrategy.banktransfer_immediate;
    }

    if (
      order.paymentsMethod === PAYMENTS_METHOD.bank_transfer &&
      order.orderStatus === ORDER_STATUS.preparing
    ) {
      return partialCancelStrategy.banktransfer_cancel_request;
    }

    const error = new BusinessLogicError('해당 주문상태에선 주문취소를 지원하지 않습니다.');
    error.setDevMessage('order 파라미터가 잘못되었습니다');
    throw error;
  }
}

export type AdminPartialCancelStrategy = 'pg' | 'banktransfer_immediate';

export interface CreateAdminPartialCancleCommandDto {
  strategy: AdminPartialCancelStrategy;
  order: Order;
  orderProductId: number;
}

export class AdminOrderPartialCancelCommandFactory {
  public static createCommand(dto: CreateAdminPartialCancleCommandDto) {
    switch (dto.strategy) {
      case partialCancelStrategy.pg:
        return new PGPartialCancelCommand(dto.order, dto.orderProductId);
      case partialCancelStrategy.banktransfer_immediate:
        return new AdminBankTransferPartialCancel(dto.order, dto.orderProductId);
      default:
        const error = new BusinessLogicError('주문상품을 취소하는데 문제가 발생했습니다');
        error.setDevMessage('올바르지 않은 취소 strategy 입니다');
        throw error;
    }
  }

  public static getCancelStrategy(order: Order): AdminPartialCancelStrategy {
    if (order.paymentsMethod === PAYMENTS_METHOD.bank_transfer) {
      return partialCancelStrategy.banktransfer_immediate;
    }

    if (order.paymentsMethod === PAYMENTS_METHOD.credit_card) {
      return partialCancelStrategy.pg;
    }

    const error = new BusinessLogicError('해당 주문상태에선 주문취소를 지원하지 않습니다.');
    error.setDevMessage('order 파라미터가 잘못되었습니다');
    throw error;
  }
}
