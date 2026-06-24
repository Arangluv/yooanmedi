import { FindOption } from '@/shared';
import { POINT_ACTION } from '../constants';
import { CreateRollbackPointHistoryRequestDto } from '../dto';

export const PointHistoryFindOption = {
  findOne: {
    earn: (dto: CreateRollbackPointHistoryRequestDto): FindOption => {
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
            equals: POINT_ACTION.earn,
          },
        },
      };
    },
    use: (dto: CreateRollbackPointHistoryRequestDto): FindOption => {
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
  },
};
