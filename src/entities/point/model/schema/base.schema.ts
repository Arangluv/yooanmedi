import { z } from 'zod';
import { POINT_ACTION } from '../../constants/point-action';

export const baseSchema = {
  user: z.number('user가 누락되었습니다.'),
  orderProduct: z.number('orderProduct가 누락되었습니다.'),
  amount: z.number('amount는 0 이상이어야 합니다.').min(0, 'amount는 0 이상이어야 합니다.'),
  type: z.enum([
    POINT_ACTION.use,
    POINT_ACTION.earn,
    POINT_ACTION.cancel_use,
    POINT_ACTION.cancel_earn,
  ]),
};
