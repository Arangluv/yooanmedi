import { z } from 'zod';
import { cartDetailSchema } from '../schemas';

export type CartDetail = z.infer<typeof cartDetailSchema>;
