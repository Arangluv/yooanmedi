import { z } from 'zod';
import { joinFormValidation } from './form-validation';

export type JoinForm = z.infer<typeof joinFormValidation>;
