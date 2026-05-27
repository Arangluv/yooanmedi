import { FindOption } from '@/shared';
import { POINT_ACTION } from '../constants';
import {
  CreateCancelUsePointHistoryRequestDto,
  CreateCancelEarnPointHistoryRequestDto,
} from '../dto';

export const PointTransactionFindOption = {
  orderProduct: {
    cancel_use: (dto: CreateCancelUsePointHistoryRequestDto): FindOption => {
      return {
        pagination: false,
        where: {
          user: {
            equals: dto.user,
          },
          orderProduct: {
            equals: dto.orderProduct,
          },
          type: {
            equals: POINT_ACTION.use,
          },
        },
      };
    },
    cancel_earn: (dto: CreateCancelEarnPointHistoryRequestDto): FindOption => {
      return {
        pagination: false,
        where: {
          user: {
            equals: dto.user,
          },
          orderProduct: {
            equals: dto.orderProduct,
          },
          type: {
            equals: POINT_ACTION.cancel_earn,
          },
        },
      };
    },
  },
};
