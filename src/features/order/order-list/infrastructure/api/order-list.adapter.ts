import { type FindOption } from '@/shared';
import { getPayload } from '@/shared/infrastructure';

export const OrderListAdapter = () => ({
  getOrderList: async (option: FindOption) => {
    const payload = await getPayload();
    const { docs, totalDocs } = await payload.find({
      collection: 'order',
      ...option,
    });

    return { docs, totalDocs };
  },
});
