import { getPayload as getPayloadToLibrary, BasePayload } from 'payload';
import config from '@/payload.config';

export const getPayload = async (): Promise<BasePayload> => {
  return await getPayloadToLibrary({ config: config });
};
