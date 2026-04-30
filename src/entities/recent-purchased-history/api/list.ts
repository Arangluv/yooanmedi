import { getPayload } from '@/shared/lib/get-payload';
import { RecentPurchasedHistoryListRequestDto } from '../model/schemas/history-list.schema';

export const getRecentPurchasedHistoryList = async (dto: RecentPurchasedHistoryListRequestDto) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'recent-purchased-history',
    select: {
      id: true,
      quantity: true,
      amount: true,
      createdAt: true,
    },
    sort: '-createdAt',
    where: {
      user: { equals: dto.userId },
      product: { equals: dto.productId },
    },
    limit: 3,
  });

  return docs;
};
