import { POINT_ACTION } from '../../constants';
import { PointTransaction } from '../../types';

export const PointTransactionFixtures = {
  valid: {
    basic: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 16,
    } as PointTransaction,

    zeroAmount: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 0,
    } as PointTransaction,
  },

  invalid: {
    emptyId: {
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 233,
    } as PointTransaction,

    emptyUser: {
      id: 1,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: 133,
    } as PointTransaction,

    emptyOrderProduct: {
      id: 1,
      user: 3,
      type: POINT_ACTION.use,
      amount: 133,
    } as PointTransaction,

    emptyType: {
      id: 1,
      user: 3,
      orderProduct: 6,
      amount: 133,
    } as PointTransaction,

    emptyAmount: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
    } as PointTransaction,

    invalidType: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: 'invalid-type' as any,
      amount: 133,
    } as PointTransaction,

    negativeAmount: {
      id: 1,
      user: 3,
      orderProduct: 6,
      type: POINT_ACTION.use,
      amount: -80,
    } as PointTransaction,
  },
};

export const createPointTransactionFixture = (
  override?: Partial<PointTransaction>,
): PointTransaction => {
  return {
    ...PointTransactionFixtures.valid.basic,
    ...override,
  };
};
