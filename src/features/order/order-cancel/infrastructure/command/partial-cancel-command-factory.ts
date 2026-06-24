import {
  BankTransferPartialCancelCommandForImmediate,
  BankTransferPartialCancelCommandForPaied,
  BankTransferPartialCancelCommandForRequest,
} from './bank-transfer';
import { PGPartialCancelCommand } from './pg';
import { getClientPartialCancelStrategy, getAdminPartialCancelStrategy } from '../libs';
import { PartialCancelOrderRequestDto } from '../../dto';
import { CancelOrderServiceDependencies } from '../../core';

export class ClientPartialOrderCancelCommandFactory {
  static createCommand({
    dto,
    dependencies,
  }: {
    dto: PartialCancelOrderRequestDto;
    dependencies: CancelOrderServiceDependencies;
  }) {
    const strategy = getClientPartialCancelStrategy(dto.order);

    switch (strategy) {
      case 'pg':
        return new PGPartialCancelCommand(dependencies, dto);
      case 'banktransfer_immediate':
        return new BankTransferPartialCancelCommandForImmediate(dependencies, dto);
      case 'banktransfer_cancel_request':
        return new BankTransferPartialCancelCommandForRequest(dependencies, dto);
    }
  }
}

export class AdminOrderPartialCancelCommandFactory {
  static createCommand({
    dto,
    dependencies,
  }: {
    dto: PartialCancelOrderRequestDto;
    dependencies: CancelOrderServiceDependencies;
  }) {
    const strategy = getAdminPartialCancelStrategy(dto.order);

    switch (strategy) {
      case 'pg':
        return new PGPartialCancelCommand(dependencies, dto);
      case 'banktransfer_immediate':
        return new BankTransferPartialCancelCommandForImmediate(dependencies, dto);
      case 'banktransfer_paid':
        return new BankTransferPartialCancelCommandForPaied(dependencies, dto);
    }
  }
}
