import { type FindOption } from '@/shared';
import { getPayload, getTransactionContext } from '@/shared/infrastructure';
import { type UpdateOrderProductDto } from '../model/schemas/order-product.schema';

// todo :: 트랜젝션을 위한 get을 따로 만들어두었으나 추후 수정이 필요합니다.
export const getOrderProduct = async (id: number) => {
  const { payload, transactionID } = getTransactionContext();
  const orderProduct = await payload.findByID({
    collection: 'order-product',
    id,
    depth: 0,
    req: {
      transactionID,
    },
  });

  return orderProduct;
};

export const getOrderProducts = async (options: FindOption) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'order-product',
    depth: 0,
    ...options,
  });

  return docs;
};

// todo :: 트랜젝션을 위한 get을 따로 만들어두었으나 추후 수정이 필요합니다.
export const getOrderProductsWithTransaction = async (options: FindOption) => {
  const { payload, transactionID } = getTransactionContext();
  const { docs } = await payload.find({
    collection: 'order-product',
    depth: 0,
    ...options,
    req: {
      transactionID,
    },
  });

  return docs;
};

export const updateOrderProducts = async (
  orderProductIds: number[],
  dto: UpdateOrderProductDto,
) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.update({
    collection: 'order-product',
    where: {
      id: {
        in: orderProductIds,
      },
    },
    data: dto,
    req: {
      transactionID,
    },
  });
};

export const updateOrderProduct = async (orderProductId: number, dto: UpdateOrderProductDto) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.update({
    collection: 'order-product',
    where: {
      id: {
        equals: orderProductId,
      },
    },
    data: dto,
    req: {
      transactionID,
    },
  });
};
