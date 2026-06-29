import { z } from 'zod';
import { PayloadMetaSetting } from '@/shared';
import { metaSettingSchema } from '../schemas';

export type MetaSettingEntity = PayloadMetaSetting;
export type MetaSetting = z.infer<typeof metaSettingSchema>;
