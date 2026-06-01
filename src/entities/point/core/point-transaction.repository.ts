import { FindOption } from '@/shared';
import { CreatePointTransactionEntity, PointTransaction, UserReference } from '../types';

export interface PointTransactionRepository {
  create: (entity: CreatePointTransactionEntity) => Promise<PointTransaction>;
  findOne: (option: FindOption) => Promise<PointTransaction>;
}
