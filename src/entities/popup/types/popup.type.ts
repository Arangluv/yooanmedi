import { z } from 'zod';
import { popupSchema } from '../schemas';
import { PayloadPopup } from '@/shared';

export type Popup = z.infer<typeof popupSchema>;
export type PopupEntity = PayloadPopup;
