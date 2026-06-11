import { FindOption } from '@/shared';
import { PointHistory } from '../types';
import { CreateUsagePointHistoryRequestDto, CreateRollbackPointHistoryRequestDto } from '../dto';

export interface PointHistoryRepository {
  createUsageHistory: (entity: CreateUsagePointHistoryRequestDto) => Promise<PointHistory>;
  createRollbackHistory: (entity: CreateRollbackPointHistoryRequestDto) => Promise<PointHistory>;
  findOne: (option: FindOption) => Promise<PointHistory>;
}
