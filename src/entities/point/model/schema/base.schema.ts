import { z } from 'zod';
import { POINT_ACTION } from '../../constants/point-action';

export const baseSchema = {
  user: z.number('user가 누락되었습니다.'),
  orderProduct: z.number('orderProduct가 누락되었습니다.'),
  amount: z.number('amount는 0 이상이어야 합니다.').min(0, 'amount는 0 이상이어야 합니다.'),
  type: z.enum([
    POINT_ACTION.USE,
    POINT_ACTION.EARN,
    POINT_ACTION.CANCEL_USE,
    POINT_ACTION.CANCEL_EARN,
  ]),
};
