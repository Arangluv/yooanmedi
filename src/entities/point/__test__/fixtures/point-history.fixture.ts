import { POINT_ACTION } from '../../constants';
import { PointHistory, PointHistoryEntity } from '../../types';
import { CreateRollbackPointHistoryRequestDto, CreateUsagePointHistoryRequestDto } from '../../dto';

const basePointHistoryFixtures = {
  id: 1,
  user: 3,
  orderProduct: 6,
  type: POINT_ACTION.use,
  amount: 16,
} as PointHistory;

export const createPointHistoryFixture = (override?: Partial<PointHistory>): PointHistory => {
  return {
    ...basePointHistoryFixtures,
    ...override,
  };
};

export const basePointHistoryEntityFixture = {
  id: 3416,
  user: 3,
  orderProduct: 1869,
  type: 'USE',
  reason: null,
  amount: 156,
  updatedAt: '2026-05-13T07:42:38.801Z',
  createdAt: '2026-05-13T07:42:39.285Z',
} as PointHistoryEntity;

export const createPointHistoryEntityFixture = (
  override?: Partial<typeof basePointHistoryEntityFixture>,
): PointHistoryEntity => {
  return {
    ...basePointHistoryEntityFixture,
    ...override,
  };
};

export const PointHistoryDtoFixtures = {
  create: {
    usage: {
      user: 1,
      orderProduct: 3,
      amount: 3000,
      type: 'EARN',
    } as CreateUsagePointHistoryRequestDto,

    rollback: {
      user: 1,
      orderProduct: 3,
      type: 'CANCEL_EARN',
    } as CreateRollbackPointHistoryRequestDto,
  },
};
