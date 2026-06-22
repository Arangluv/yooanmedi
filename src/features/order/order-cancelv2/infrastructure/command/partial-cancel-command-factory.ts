import {
  BankTransferPartialCancelCommandForImmediate,
  BankTransferPartialCancelCommandForPaied,
  BankTransferPartialCancelCommandForRequest,
} from './bank-transfer';
import { PGPartialCancelCommand } from './pg';
import { PartialCancelOrderRequestDto } from '../../dto';
import { getClientPartialCancelStrategy, getAdminPartialCancelStrategy } from '../libs';
import { ClientCancelOrderServiceDependencies, AdminOrderServiceDependencies } from '../service';

export class ClientPartialOrderCancelCommandFactory {
  static createCommand({
    dto,
    dependencies,
  }: {
    dto: PartialCancelOrderRequestDto;
    dependencies: ClientCancelOrderServiceDependencies;
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
    dependencies: AdminOrderServiceDependencies;
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
