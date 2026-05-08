import 'server-only';
import { getPayload, getTransactionContext } from '@/shared/infrastructure';
import { UpdateOrderDto } from '../model/schemas/order.schema';
import { FindOption } from '@/shared';
import type {
  CreateOrderEntity,
  CreateOrderResponseDto,
} from '../model/schemas/create-order.schema';

// TODO:: update-delete 시 DB와 가장 가까운 부분에서 어떤걸 return할지에 대한 고민
export const updateOrder = async (orderId: number, data: UpdateOrderDto) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.update({
    collection: 'order',
    where: {
      id: {
        equals: orderId,
      },
    },
    data,
    req: {
      transactionID,
    },
  });
};

export const getOrder = async (orderId: number) => {
  const payload = await getPayload();
  const order = await payload.findByID({
    collection: 'order',
    id: orderId,
    depth: 0,
  });

  return order;
};

export const getOrderList = async (option: FindOption) => {
  const payload = await getPayload();
  const { docs, totalDocs } = await payload.find({
    collection: 'order',
    depth: 0,
    ...option,
  });

  return { docs, totalDocs };
};

export const createOrder = async (order: CreateOrderEntity): Promise<CreateOrderResponseDto> => {
  const { payload, transactionID } = getTransactionContext();

  const createdOrder = await payload.create({
    collection: 'order',
    data: order,
    select: {},
    req: {
      transactionID,
    },
  });

  return createdOrder;
};
