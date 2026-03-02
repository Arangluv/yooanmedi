import { getPayload } from '@/shared/lib/get-payload';
import { User } from '@/entities/user';

export const findOrderUserId = async (orderId: number) => {
  const payload = await getPayload();

  const order = await payload.findByID({
    collection: 'order',
    id: orderId,
    select: {
      user: true,
    },
    populate: {
      users: {}, // TODO:: 이 부분 개선할 수 없을까. 이렇게 적으면 id만 넘어오지만 왜 이렇게 적어야하는지에 대한 이유를 알 수 없다.
    },
  });

  return (order.user as User).id;
};
