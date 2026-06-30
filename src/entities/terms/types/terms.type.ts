import { z } from 'zod';
import { PayloadTerms } from '@/shared';
import { termsSchema } from '../schemas';

export type Terms = z.infer<typeof termsSchema>;
export type TermsEntity = PayloadTerms;
