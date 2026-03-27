'use server';

import { getPayload } from '@/shared';

import {
  CreateOrderDto,
  CreateOrderParseResult,
  createOrderSchema,
} from '../model/create-order.schema';
import type { Order } from '../model/type';

interface CreateOrderProps {
  dto: CreateOrderDto;
  transactionID?: string | number;
}

export const createOrder = async ({ dto, transactionID }: CreateOrderProps): Promise<Order> => {
  const payload = await getPayload();

  try {
    const data: CreateOrderParseResult = createOrderSchema.parse(dto);

    const order = await payload.create({
      collection: 'order',
      data,
      ...(transactionID ? { req: { transactionID } } : {}),
    });

    return order;
  } catch (error) {
    throw new Error('주문내역을 생성하는데 문제가 발생했습니다');
  }
};
