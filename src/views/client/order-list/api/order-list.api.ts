'use server';

import { clientOrderListService, ClientOrderListSearchParams } from '@/features/order/order-list';
import {
  clientCancelOrderService,
  PartialCancelOrderRequestDto,
} from '@/features/order/order-cancel';

export const partialCancelOrder = async (dto: PartialCancelOrderRequestDto) => {
  return await clientCancelOrderService.partialCancel(dto);
};

export const getOrderList = async (searchParams: ClientOrderListSearchParams) => {
  return await clientOrderListService.getOrderList(searchParams);
};
