import { FindOption } from '@/shared';
import { PointTransaction } from '../types';
import { CreatePointHistoryRequestDto } from '../dto';

export interface PointTransactionRepository {
  create: (entity: CreatePointHistoryRequestDto) => Promise<PointTransaction>;
  findOne: (option: FindOption) => Promise<PointTransaction>;
}
