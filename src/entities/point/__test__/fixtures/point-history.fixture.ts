import { POINT_ACTION } from '../../constants';
import { PointHistory, PointHistoryEntity } from '../../types';

export const PointHistoryFixtures = {
  valid: {
    basic: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 16,
    } as PointHistory,

    zeroAmount: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 0,
    } as PointHistory,
  },

  invalid: {
    emptyId: {
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 233,
    } as PointHistory,

    emptyUser: {
      id: 1,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 133,
    } as PointHistory,

    emptyOrderProduct: {
      id: 1,
      user: 3,
      type: POINT_ACTION.use,
      amount: 133,
    } as PointHistory,

    emptyType: {
      id: 1,
      user: 3,
      orderProduct: 6,
      amount: 133,
    } as PointHistory,

    emptyAmount: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
    } as PointHistory,

    invalidType: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: 'invalid-type' as any,
      amount: 133,
    } as PointHistory,

    negativeAmount: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: -80,
    } as PointHistory,
  },
};

export const createPointHistoryFixture = (override?: Partial<PointHistory>): PointHistory => {
  return {
    ...PointHistoryFixtures.valid.basic,
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
