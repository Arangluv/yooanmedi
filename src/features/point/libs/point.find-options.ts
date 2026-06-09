import { FindOption } from '@/shared';
import { POINT_ACTION } from '@/entities/point';
import { CreatePointRefundHistoryRequestDto } from '../dto';

export const PointFindOption = {
  findOne: {
    earn: (dto: CreatePointRefundHistoryRequestDto): FindOption => {
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
    use: (dto: CreatePointRefundHistoryRequestDto): FindOption => {
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
