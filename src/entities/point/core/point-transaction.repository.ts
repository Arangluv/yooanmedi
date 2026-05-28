import { FindOption } from '@/shared';
import { CreatePointTransactionEntity, PointTransaction, UserReference } from '../types';

export interface PointTransactionRepository {
  create: (entity: CreatePointTransactionEntity) => Promise<PointTransaction>;
  findOne: (option: FindOption) => Promise<PointTransaction>;
  updateUserPoint: ({ userId, amount }: { userId: number; amount: number }) => Promise<void>;
  getUser: (userId: number) => Promise<UserReference>;
}
