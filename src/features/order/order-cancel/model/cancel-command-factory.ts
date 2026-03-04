import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { ORDER_ACTION, OrderAction } from '@/entities/order/constants/order-action';

import { OrderCommand } from './command/base-command';
import { CancelBeforePaymentCommand } from './command/cancel-before-payment-command';
import { CancelAfterPaymentCommand } from './command/cancel-after-payment-command';
import { CancelRequestCommand } from './command/cancel-request-command';

export class CancelCommandFactory {
  static createCommand(fromStatus: OrderStatus, action: OrderAction): OrderCommand {
    switch (fromStatus) {
      case ORDER_STATUS.PENDING:
        if (action === ORDER_ACTION.CANCEL_BEFORE_PAYMENT) {
          return new CancelBeforePaymentCommand();
        }
        if (action === ORDER_ACTION.CANCEL_REQUEST) {
          return new CancelRequestCommand();
        }
        break;
      case ORDER_STATUS.PREPARING:
        return new CancelAfterPaymentCommand();
      case ORDER_STATUS.SHIPPING:
        return new CancelAfterPaymentCommand();
      case ORDER_STATUS.DELIVERED:
        return new CancelAfterPaymentCommand();
      case ORDER_STATUS.CANCEL_REQUEST:
        return new CancelAfterPaymentCommand();
    }

    throw new Error('[cancelCommandFactory] 해당 상태에서 사용할 수 없는 커맨드입니다');
  }
}
