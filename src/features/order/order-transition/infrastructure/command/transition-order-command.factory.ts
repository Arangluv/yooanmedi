import { PAYMENTS_METHOD } from '@/shared';
import { Order } from '@/entities/order';
import {
  PGTransitionOrderCommand,
  PGTransitionOrderCommandDependencies,
} from './pg-transition-order.command';
import {
  BankTransferTransitionOrderCommand,
  BankTransferTransitionOrderCommandDependencies,
} from './bank-transfer-transition-order.command';
import { TransitionOrderScenarioResolver, TransitionOrderError } from '../../core';
import { TransitionOrderMapper } from '../../mapper';
import { TransitionOrderServiceDependencies } from '../services';

export class TransitionOrderCommandFactory {
  public static createCommand(order: Order, dependencies: TransitionOrderServiceDependencies) {
    switch (order.paymentsMethod) {
      case PAYMENTS_METHOD.credit_card: {
        const commandDependencies: PGTransitionOrderCommandDependencies = {
          payload: dependencies.payload,
          repository: {
            order: dependencies.repository.order,
            orderProduct: dependencies.repository.orderProduct,
          },
        };

        const scenario = TransitionOrderScenarioResolver.getTransitionScenarioForPG(order);
        const commandDto = TransitionOrderMapper.toPGCommandDto({ order, scenario });

        return new PGTransitionOrderCommand(commandDependencies, commandDto);
      }

      case PAYMENTS_METHOD.bank_transfer: {
        const commandDependencies: BankTransferTransitionOrderCommandDependencies = {
          payload: dependencies.payload,
          repository: {
            order: dependencies.repository.order,
            orderProduct: dependencies.repository.orderProduct,
            user: dependencies.repository.user,
            pointHistory: dependencies.repository.pointHistory,
          },
        };

        const scenario =
          TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order);
        const commandDto = TransitionOrderMapper.toBankCommandDto({ order, scenario });

        return new BankTransferTransitionOrderCommand(commandDependencies, commandDto);
      }

      default:
        throw TransitionOrderError.invalidData(order);
    }
  }
}
