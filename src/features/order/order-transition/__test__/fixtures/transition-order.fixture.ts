import { createOrderFixture } from '@/entities/order/__test__';
import { TransitionOrderRequestDto } from '../../dto';

export const TransitionOrderFixture = {
  requestDto: {
    transitionOrder: {
      valid: {
        pg: {
          order: createOrderFixture({
            paymentsMethod: 'creditCard',
            orderStatus: 'preparing',
            paymentStatus: 'COMPLETE',
          }),
        } as TransitionOrderRequestDto,
        bank: {
          pending: {
            order: createOrderFixture({
              paymentsMethod: 'bankTransfer',
              orderStatus: 'pending',
              paymentStatus: 'PENDING',
            }),
          } as TransitionOrderRequestDto,
          preparing: {
            order: createOrderFixture({
              paymentsMethod: 'bankTransfer',
              orderStatus: 'preparing',
              paymentStatus: 'PARTIAL_CANCEL',
            }),
          } as TransitionOrderRequestDto,
        },
      },
    },
  },
};
