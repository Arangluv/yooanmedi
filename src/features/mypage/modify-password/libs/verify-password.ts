import crypto from 'crypto';

const ITERATIONS = 25000;
const KEYLEN = 512;
const DIGEST = 'sha256';

// PayloadCms payload/dist/auth/strategies/local/authenticate 참고
export const verifyPassword = (password: string, salt: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEYLEN, DIGEST, (err, derivedKey) => {
      if (err) return reject(err);
      const storedHashBuffer = Buffer.from(hash, 'hex');
      const isMatch =
        derivedKey.length === storedHashBuffer.length &&
        crypto.timingSafeEqual(derivedKey, storedHashBuffer);
      resolve(isMatch);
    });
  });
};
