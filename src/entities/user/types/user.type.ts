import { z } from 'zod';
import { userSchema, userSchemaWithHiddenField } from '../schemas';
import { PayloadUser } from '@/shared';

export type User = z.infer<typeof userSchema>;
export type UserWithHiddenField = z.infer<typeof userSchemaWithHiddenField>;
export type UserEntity = PayloadUser;
