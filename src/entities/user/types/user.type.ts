import { z } from 'zod';
import { userSchema } from '../schemas';
import { PayloadUser } from '@/shared';

export type User = z.infer<typeof userSchema>;
export type UserEntity = PayloadUser;
