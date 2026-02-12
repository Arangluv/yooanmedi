'use server';

import { getPayload } from '@/shared';
import { CreatePaymentDto, createPaymentSchema } from '../model/create-schema';

export const createPayment = async (dto: CreatePaymentDto) => {
  try {
    const payload = await getPayload();
    const data = createPaymentSchema.parse(dto);

    await payload.create({
      collection: 'payment',
      data,
    });

    return;
  } catch (error) {
    // TODO :: error 핸들링
    throw new Error('결제 내역을 생성하는데 문제가 발생했습니다');
  }
};
