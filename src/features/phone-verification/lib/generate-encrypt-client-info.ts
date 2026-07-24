'use server';

import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import crypto from 'crypto';

export const generateEncryptClientInfo = async (serverPublicKeyBase64: string) => {
  const identifier = 'YOOAN-';
  const clientTxId = identifier + uuidv4().split('-').join('').toUpperCase().substring(0, 26);
  const requestTime = dayjs().format('YYYYMMDDHHmmss');

  const jsonData = JSON.stringify({
    version: 'V2',
    clientTxId,
    requestTime,
  });

  // Step 2-3: RSA 공개키 준비
  const publicKeyBuffer = Buffer.from(serverPublicKeyBase64, 'base64');

  const publicKey = crypto.createPublicKey({
    key: publicKeyBuffer,
    format: 'der',
    type: 'spki', // X509EncodedKeySpec = spki
  });

  // RSA-OAEP SHA-256 암호화
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(jsonData, 'utf8'),
  );

  // Base64 인코딩
  const encryptReqClientInfo = encryptedData.toString('base64');

  return encryptReqClientInfo;
};
