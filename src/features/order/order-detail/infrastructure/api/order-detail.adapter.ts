import { type FindOption } from '@/shared';
import { getPayload } from '@/shared/infrastructure';

export const OrderDetailAdapter = () => ({
  getOrderDetail: async (orderId: number, option: FindOption) => {
    const payload = await getPayload();
    const order = await payload.findByID({
      collection: 'order',
      id: orderId,
      ...option,
    });

    return order;
  },
});
