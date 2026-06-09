import { createPointTransactionFixture } from '@/entities/point/__test__';
import {
  CreatePointRefundHistoryRequestDto,
  CreatePointUsageHistoryRequestDto,
  UpdateUserPointRequestDto,
} from '../../dto';

export const PointFeatureFixture = {
  create: {
    refund: {
      user: 1,
      orderProduct: 3,
      type: 'CANCEL_EARN',
      rollbackType: 'EARN',
    } as CreatePointRefundHistoryRequestDto,

    usage: {
      user: 1,
      orderProduct: 3,
      type: 'USE',
      amount: 100,
    } as CreatePointUsageHistoryRequestDto,
  },
  update: {
    user: 3,
    type: 'USE',
    histories: [
      createPointTransactionFixture({ amount: 10 }),
      createPointTransactionFixture({ amount: 20 }),
      createPointTransactionFixture({ amount: 32 }),
    ],
  } as UpdateUserPointRequestDto,
};
