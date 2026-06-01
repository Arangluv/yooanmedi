import { PayloadAdapterResult } from '@/shared/server';
import { PointTransactionEntity } from './point-transaction.type';

export type GetPointTransactionResponse = PayloadAdapterResult<PointTransactionEntity>;
export type CreatePointTransactionResponse = PayloadAdapterResult<PointTransactionEntity>;
