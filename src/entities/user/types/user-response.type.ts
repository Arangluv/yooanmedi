import { PayloadUser } from '@/shared';
import { PayloadAdapterResult } from '@/shared';

export type GetUserByHeaderResponse = PayloadAdapterResult<PayloadUser & { collection: 'users' }>;
export type GetUserByIdResponse = PayloadAdapterResult<PayloadUser>;
export type GetUserListResponse = PayloadAdapterResult<PayloadUser[]>;
export type UpdateUserResponse = PayloadAdapterResult<PayloadUser>;
