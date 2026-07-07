import { z } from 'zod';
import { updateUserSchema, createClientSchema } from '../schemas';

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type CreateClientRequestDto = z.infer<typeof createClientSchema>;
