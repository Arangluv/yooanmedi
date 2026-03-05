import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { ORDER_ACTION, OrderAction } from '@/entities/order/constants/order-action';

import { OrderCommand } from './command/base-command';
import { CancelBeforePaymentCommand } from './command/cancel-before-payment-command';
import { CancelAfterPaymentCommand } from './command/cancel-after-payment-command';
import { CreateCancelRequestCommand } from './command/create-cancel-request-command';
import { ApproveCancelRequestCommand } from './command/approve-cancel-request-command';

export class CancelCommandFactory {
  static createCommand(fromStatus: OrderStatus, action: OrderAction): OrderCommand {
    switch (fromStatus) {
      case ORDER_STATUS.PENDING:
        return new CancelBeforePaymentCommand();
      case ORDER_STATUS.PREPARING:
        if (action === ORDER_ACTION.CANCEL_REQUEST) {
          return new CreateCancelRequestCommand();
        }

        if (action === ORDER_ACTION.CANCEL_AFTER_PAYMENT) {
          return new CancelAfterPaymentCommand();
        }
        break;
      case ORDER_STATUS.SHIPPING:
        return new CancelAfterPaymentCommand();
      case ORDER_STATUS.DELIVERED:
        return new CancelAfterPaymentCommand();
      case ORDER_STATUS.CANCEL_REQUEST:
        return new ApproveCancelRequestCommand();
    }

    throw new Error('[cancelCommandFactory] 해당 상태에서 사용할 수 없는 커맨드입니다');
  }
}
