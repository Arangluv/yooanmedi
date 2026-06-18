import { PAYMENTS_METHOD } from '@/shared';
import { Order } from '@/entities/order';
import { TransitionOrderScenarioResolver, TransitionOrderError } from '../../core';
import { TransitionOrderMapper } from '../../mapper';

export class TransitionOrderCommandFactory {
  public static createCommand(order: Order) {
    switch (order.paymentsMethod) {
      case PAYMENTS_METHOD.credit_card: {
        const scenario = TransitionOrderScenarioResolver.getTransitionScenarioForPG(order);
        const commandDto = TransitionOrderMapper.toPGCommandDto({ order, scenario });
        return;
      }
      case PAYMENTS_METHOD.bank_transfer: {
        const scenario =
          TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order);
        const commandDto = TransitionOrderMapper.toBankCommandDto({ order, scenario });
        return;
      }
      default:
        throw TransitionOrderError.invalidData(order);
    }
  }
}
