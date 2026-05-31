import { FindOption } from '@/shared';
import { getTransactionContextFromStore, PayloadCms } from '@/shared/server';
import { CreatePointTransactionEntity } from '../../types';

const payload = await PayloadCms.getInstance();

export const PointTransactionAdapter = () => ({
  create: async (entity: CreatePointTransactionEntity) => {
    const req = getTransactionContextFromStore();
    const result = await payload.create({
      collection: 'point-transaction',
      data: entity,
      depth: 0,
      req,
    });

    return result;
  },

  findOne: async (option: FindOption) => {
    const req = getTransactionContextFromStore();
    const { docs } = await payload.find({
      collection: 'point-transaction',
      ...option,
      req,
    });

    return docs;
  },

  // todo :: will remove -> user entity refact 후 service단에서 사용하는 것으로 변경
  updateUserPoint: async (userId: number, amount: number) => {
    const req = getTransactionContextFromStore();

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        point: amount,
      },
      req,
    });
  },

  // todo :: will remove -> user entity refact 후 service단에서 사용하는 것으로 변경
  getUser: async (userId: number) => {
    const req = getTransactionContextFromStore();

    const user = await payload.findByID({
      collection: 'users',
      id: userId,
      select: {
        point: true,
      },
      req,
    });

    return user;
  },
});
