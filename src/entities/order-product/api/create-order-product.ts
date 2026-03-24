'use server';

import { getPayload } from '@/shared';

import { CreateOrderProductDto } from '../model/create-order-product-schema';

export const createOrderProduct = async (dto: CreateOrderProductDto) => {
  try {
    const payload = await getPayload();
    const orderProduct = await payload.create({
      collection: 'order-product',
      data: dto,
    });

    return orderProduct;
  } catch (error) {
    console.log(error);
    // TODO :: error 핸들링
    throw new Error('주문 상품을 생성하는데 문제가 발생했습니다');
  }
};
