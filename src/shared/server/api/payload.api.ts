// TODO :: will deprecated

import { getPayload as getPayloadToLibrary, BasePayload } from 'payload';
import { payloadConfig } from '../configs';

export const getPayload = async (): Promise<BasePayload> => {
  return await getPayloadToLibrary({ config: payloadConfig });
};
