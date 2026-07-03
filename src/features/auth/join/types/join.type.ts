import { z } from 'zod';
import { joinFormValidation } from '../validations';

export type JoinForm = z.infer<typeof joinFormValidation>;
