import { createPointHistoryFixture } from '@/entities/point/__test__';
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
      createPointHistoryFixture({ amount: 10 }),
      createPointHistoryFixture({ amount: 20 }),
      createPointHistoryFixture({ amount: 32 }),
    ],
  } as UpdateUserPointRequestDto,
};
