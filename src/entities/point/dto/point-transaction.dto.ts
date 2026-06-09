import { z } from 'zod';
import { createPointTransactionSchema } from '../schemas';

export type CreatePointHistoryRequestDto = z.infer<typeof createPointTransactionSchema>;
