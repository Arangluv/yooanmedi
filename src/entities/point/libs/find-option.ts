import { POINT_ACTION } from '../constants';
import { CreatePointHistoryRequestDto } from '../dto';

export const PointHistoryFindOption = {
  findOne: {
    earn: (dto: CreatePointHistoryRequestDto) => {
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
    use: (dto: CreatePointHistoryRequestDto) => {
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
