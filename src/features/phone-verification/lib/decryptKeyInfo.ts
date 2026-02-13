'use server';

import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export const decryptKeyInfo = async () => {
  const filePath = path.join(
    process.cwd(),
    'src',
    'features',
    'phone-verification',
    'config',
    'mok_keyInfo_prod.dat',
  );

  const password = '...';

  // Step 1: 파일 읽기
  const encryptedData = fs.readFileSync(filePath);

  // Step 2-1: SHA-256 인스턴스
  const sha256 = (data: Buffer) => crypto.createHash('sha256').update(data).digest();

  // Step 2-2: Hash1
  const passwordBytes = Buffer.from(password, 'utf8');
  const hash1 = sha256(passwordBytes); // 32 bytes
  const aesKeyBytes = Buffer.alloc(32);

  // hash1 앞 16바이트
  hash1.copy(aesKeyBytes, 0, 0, 16);

  // Step 2-3: Hash2
  const hash2 = sha256(hash1);

  // hash2 뒤 16바이트
  hash2.copy(aesKeyBytes, 16, 16, 32);

  // IV = hash2 앞 16바이트
  const aesIvBytes = hash2.subarray(0, 16);

  // Step 3: AES-256-CBC 복호화
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKeyBytes, aesIvBytes);

  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  // Step 4: UTF-8 변환
  const jsonResult = JSON.parse(decrypted.toString('utf8'));

  // 검증
  // ServiceId, ClientPrivateKey, ServerPublicKey

  const resultKeys = Object.keys(jsonResult);

  if (
    resultKeys.includes('ServiceId') &&
    resultKeys.includes('ClientPrivateKey') &&
    resultKeys.includes('ServerPublicKey')
  ) {
    return jsonResult;
  } else {
    throw new Error('해시키를 가져오는데 문제가 발생했습니다');
  }
};
