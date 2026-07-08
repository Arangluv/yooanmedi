import { z } from 'zod';
import { modifyPasswordDtoSchema } from '../schemas';

export type ModifyPasswordDto = z.infer<typeof modifyPasswordDtoSchema>;
