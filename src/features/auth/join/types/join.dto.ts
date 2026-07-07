import { User } from '@/entities/user';

export type JoinUniqueCheckFieldDto = { field: keyof User; value: string; message: string };
export type CheckDuplicatedFieldResultDto = { field: keyof User; message: string };
