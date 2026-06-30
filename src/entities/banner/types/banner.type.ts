import { z } from 'zod';
import { PayloadBanner } from '@/shared';
import { bannerSchema } from '../schemas';

export type BannerEntity = PayloadBanner;
export type Banner = z.infer<typeof bannerSchema>;
