'use server';

import crypto from 'crypto';

export type MokResultDto = {
  siteId: string;
  clientTxId: string;
  txId: string;
  providerId: string;
  serviceType: string;
  ci: string;
  di: string;
  userName: string;
  userPhone: string;
  userBirthday: string;
  userGender: string;
  userNation: string;
  reqAuthType: string;
  reqDate: string;
  issuer: string;
  issueDate: string;
};

export const payloadDecode = async (encryptMOKResult: string) => {
  try {
    // -----------------------------
    // Step 1: 결과 분리
    // -----------------------------
    const [encryptKeyIvHashData, encryptResultData] = encryptMOKResult.split('|');

    if (!encryptKeyIvHashData || !encryptResultData) {
      throw new Error('Invalid encryptMOKResult format');
    }

    // -----------------------------
    // Step 2: PrivateKey 생성 (PKCS8 DER)
    // -----------------------------
    const privateKey = crypto.createPrivateKey({
      key: Buffer.from(process.env.MOK_CLIENT_PRIVATE_KEY!, 'base64'),
      format: 'der',
      type: 'pkcs8',
    });

    // RSA 복호화
    const rsaDecrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(encryptKeyIvHashData, 'base64'),
    );

    const keyIvHashData = rsaDecrypted.toString('utf8');

    // -----------------------------
    // Step 2-4: keyIv + hash 분리
    // -----------------------------
    const [base64KeyIv, hashData] = keyIvHashData.split('|');

    if (!base64KeyIv || !hashData) {
      throw new Error('Invalid keyIvHashData format');
    }

    // -----------------------------
    // Step 3: AES Key / IV 추출
    // -----------------------------
    const keyIv = Buffer.from(base64KeyIv, 'base64');

    if (keyIv.length !== 48) {
      throw new Error('Invalid keyIv length');
    }

    const key = keyIv.subarray(0, 32);
    const iv = keyIv.subarray(32, 48);

    // -----------------------------
    // Step 4: AES 복호화
    // -----------------------------
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    const decryptedBuffer = Buffer.concat([
      decipher.update(Buffer.from(encryptResultData, 'base64')),
      decipher.final(),
    ]);

    const result = decryptedBuffer.toString('utf8');

    // -----------------------------
    // Step 5: SHA256 무결성 검증
    // -----------------------------
    const computedHash = crypto.createHash('sha256').update(result, 'utf8').digest('base64');

    if (computedHash !== hashData) {
      throw new Error('Hash verification failed: Data integrity compromised');
    }

    return JSON.parse(result) as MokResultDto;
  } catch (error) {
    console.log(error);
    return null;
  }
};
