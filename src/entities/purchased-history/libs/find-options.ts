import { FindOption } from '@/shared';
import { GetPurchasedHistoriesRequestDto } from '../dto/purchased-history.dto';

export const PurchasedHistoryFindOption = {
  list: {
    build: (dto: GetPurchasedHistoriesRequestDto): FindOption => ({
      pagination: false,
      limit: 3,
      sort: '-createdAt',
      where: {
        user: { equals: dto.user },
        product: { equals: dto.product },
      },
    }),
  },
};
