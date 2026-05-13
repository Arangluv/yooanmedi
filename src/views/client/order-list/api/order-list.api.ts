'use server';

import { ok, failure, normalizeError, EndPointResult } from '@/shared';
import { ClientOrderListService } from '../model/client-order-list.service';
import { ClientOrder } from '@/features/order/order-list';
import { Logger } from '@/shared/infrastructure';

export interface ClientPartialOrderCancelRequestDto {
  order: ClientOrder;
  targetOrderProductId: number;
}

export const partialCancelOrder = async (
  dto: ClientPartialOrderCancelRequestDto,
): Promise<EndPointResult> => {
  try {
    const orderListService = new ClientOrderListService();
    await orderListService.cancelOrder(dto);

    return ok('상품 주문을 취소했습니다');
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};
