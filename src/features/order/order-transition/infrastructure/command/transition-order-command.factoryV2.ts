import { PAYMENTS_METHOD } from '@/shared';
import { getPayload } from '@/shared/server';
import { Order } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
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

export class TransitionOrderCommandFactory {
  public static async createCommand(order: Order) {
    switch (order.paymentsMethod) {
      case PAYMENTS_METHOD.credit_card: {
        const payload = await getPayload();
        const dependencies: PGTransitionOrderCommandDependencies = {
          payload,
          repository: {
            order: new OrderApiRepository(OrderAdapter()),
            orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
          },
        };

        const scenario = TransitionOrderScenarioResolver.getTransitionScenarioForPG(order);
        const commandDto = TransitionOrderMapper.toPGCommandDto({ order, scenario });

        return new PGTransitionOrderCommand(dependencies, commandDto);
      }

      case PAYMENTS_METHOD.bank_transfer: {
        const payload = await getPayload();
        const dependencies: BankTransferTransitionOrderCommandDependencies = {
          payload,
          repository: {
            order: new OrderApiRepository(OrderAdapter()),
            orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
            user: new UserApiRepository(UserAdapter()),
            pointHistory: new PointHistoryApiRepository(PointHistoryAdapter()),
          },
        };

        const scenario =
          TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order);
        const commandDto = TransitionOrderMapper.toBankCommandDto({ order, scenario });

        return new BankTransferTransitionOrderCommand(dependencies, commandDto);
      }

      default:
        throw TransitionOrderError.invalidData(order);
    }
  }
}
