import { PayloadAdapterResult } from '@/shared';
import { PointHistoryEntity } from './point-history.type';

export type CreatePointHistoryResponse = PayloadAdapterResult<PointHistoryEntity>;
export type GetPointHistoryResponse = PayloadAdapterResult<PointHistoryEntity>;
