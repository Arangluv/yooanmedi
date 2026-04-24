import { getPayload as getPayloadToLibrary } from 'payload';
import config from '@/payload.config';

export const getPayload = async () => {
  return await getPayloadToLibrary({ config: config });
};
