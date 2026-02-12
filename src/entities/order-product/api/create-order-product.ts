'use server';

import { getPayload } from '@/shared';

import {
  CreateOrderProductDto,
  CreateOrderProductParseResult,
  createOrderProductSchema,
} from '../model/create-order-product-schema';

export const createOrderProduct = async ({ dto }: { dto: CreateOrderProductDto }) => {
  try {
    const payload = await getPayload();

    const data: CreateOrderProductParseResult = createOrderProductSchema.parse(dto);
    const orderProduct = await payload.create({
      collection: 'order-product',
      data,
    });

    return orderProduct;
  } catch (error) {
    console.log(error);
    // TODO :: error 핸들링
    throw new Error('주문 상품을 생성하는데 문제가 발생했습니다');
  }
};
