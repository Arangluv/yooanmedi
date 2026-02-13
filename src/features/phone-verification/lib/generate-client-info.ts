'use server';

// import { decryptKeyInfo } from './decryptKeyInfo';
import { generateEncryptClientInfo } from './generate-encrypt-client-info';
import { USAGE_CODE } from '../constants/usage-code';
import {
  ENCRYPT_VERSION,
  RET_TRANSFER_TYPE,
  RETURN_URL,
  SERVICE_TYPE,
} from '../constants/service-type';

export const generateClientInfo = async (usageCode: keyof typeof USAGE_CODE) => {
  const encryptClientInfo = await generateEncryptClientInfo(process.env.MOK_SERVER_PUBLIC_KEY!);

  const dataMap = new Map<string, string>();
  dataMap.set('serviceId', process.env.MOK_SERVICE_ID!);
  dataMap.set('encryptReqClientInfo', encryptClientInfo);
  dataMap.set('usageCode', USAGE_CODE[usageCode]);
  dataMap.set('serviceType', SERVICE_TYPE);
  dataMap.set('retTransferType', RET_TRANSFER_TYPE);
  dataMap.set('returnUrl', RETURN_URL);
  dataMap.set('encryptVersion', ENCRYPT_VERSION);

  // map to object
  const data = Object.fromEntries(dataMap);
  return data;
};
