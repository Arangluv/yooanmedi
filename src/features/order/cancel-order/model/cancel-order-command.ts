import { ORDER_PRODUCT_STATUS, OrderProductStatus } from '@/entities/order-product';
import { BusinessLogicError } from '@/shared';

// TODO:: 나중에 TransactionCommand를 상속 해당 주석은 무시해라
interface IPartialCancelOrderCommand {
  execute: () => Promise<any>;
}
interface ITotalCancelOrderCommand {
  execute: () => Promise<any>;
}

/**
 * 시나리오
 * 1. 무통장입금
 *  -> 모든 상태 -> 주문취소 상태
 * 2. PG사 결제
 *  -> 모든 상태 -> 주문취소상태
 */
export class AdminPartialCancelOrderCommand implements IPartialCancelOrderCommand {
  public async execute() {
    throw new Error('not implements');
  }
}

export class AdminTotalCancelOrderCommand implements IPartialCancelOrderCommand {
  public async execute() {
    throw new Error('not implements');
  }
}

/**
 * 시나리오
 * 1. 무통장입금
 *  -> pending -> 주문취소 상태
 *  -> preparing -> 취소요청 상태
 * 2. PG사 결제
 *  -> preparing -> 주문취소상태
 */
export class ClientPartialCancelOrderCommand implements IPartialCancelOrderCommand {
  public async execute() {
    // Admin과의 차이가 -> 실행할 수 있는 현재 주문상태, 취소요청상태를 보낸다라는게 차이
    if (!this.canPartialCancel('asd' as any)) {
      const error = new BusinessLogicError('주문상품을 취소하는데 문제가 발생했습니다');
      error.setDevMessage('해당 상태에서는 주문을 취소할 수 없습니다');
      throw error;
    }

    // 해당 부분에서 상태는 pending or preparing
    // pending -> 바로 취소(반드시 무통장 입금결제임)
    // preparing (분기 발생)
    //  -> 취소요청 (무통장입금)
    //  -> 주문취소 (PG사 결제)
    throw new Error('not implements');
  }

  private canPartialCancel(orderProductStatus: OrderProductStatus) {
    if (orderProductStatus === ORDER_PRODUCT_STATUS.pending || ORDER_PRODUCT_STATUS.preparing) {
      return true;
    }

    return false;
  }
}
