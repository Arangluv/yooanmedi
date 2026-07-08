import { z } from 'zod';
import { PayloadFile } from '@/shared';
import { fileSchema } from '../schemas';

export type File = z.infer<typeof fileSchema>;
export type FileEntity = PayloadFile;
