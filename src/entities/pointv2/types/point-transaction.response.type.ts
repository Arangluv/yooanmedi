import { PayloadAdapterResult } from '@/shared';
import { PointTransactionEntity } from './point-transaction.type';

export type CreatePointTransactionResponse = PayloadAdapterResult<PointTransactionEntity>;
export type GetPointTransactionResponse = PayloadAdapterResult<PointTransactionEntity>;
