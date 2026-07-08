import { z } from 'zod';
import { modifyPasswordFormValidation } from '../validations';

export type ModifyPasswordForm = z.infer<typeof modifyPasswordFormValidation>;
