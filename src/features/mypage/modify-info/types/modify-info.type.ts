import { z } from 'zod';
import { modifyUserInfoFormValidation } from '../validations';

export type ModifyInfoForm = z.infer<typeof modifyUserInfoFormValidation>;
