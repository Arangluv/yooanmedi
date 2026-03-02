import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { OrderCommand } from './command/base-command';
import { ProceedToPreparingCommand } from './command/proceed-to-preparing';
import { ProceedToShippingCommand } from './command/proceed-to-shipping';
import { ProceedToDeliveredCommand } from './command/proceed-to-delivered';

export class ProceedCommandFactory {
  static createCommand(fromStatus: OrderStatus): OrderCommand {
    switch (fromStatus) {
      case ORDER_STATUS.PENDING:
        return new ProceedToPreparingCommand();
      case ORDER_STATUS.PREPARING:
        return new ProceedToShippingCommand();
      case ORDER_STATUS.SHIPPING:
        return new ProceedToDeliveredCommand();
    }

    throw new Error('[proceed] 해당 상태에서 사용할 수 없는 커맨드입니다');
  }
}
