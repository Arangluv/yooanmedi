import { FindOption } from '@/shared';
import { CreatePointTransactionDto, PointTransaction } from '../types';

export interface PointTransactionRepository {
  create: (entity: CreatePointTransactionDto) => Promise<PointTransaction>;
  findOne: (option: FindOption) => Promise<PointTransaction>;
}
