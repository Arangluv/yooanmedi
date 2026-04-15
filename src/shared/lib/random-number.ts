/**
 * length 자리 숫자로 이루어진 랜덤 숫자를 생성합니다.
 *
 * @example
 * ```ts
 * const randomNumber = generateRandomNumber({ length: 15 });
 * console.log(randomNumber); // '202604071234567890'
 * ```
 */
export const generateRandomNumber = ({ length }: { length: number }) => {
  const now = new Date();
  const yyyymmdd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const DATE_LENGTH = 8;
  const randomNum = Math.floor(
    10 ** (length - DATE_LENGTH - 1) + Math.random() * 9 * 10 ** (length - DATE_LENGTH - 1),
  );

  return yyyymmdd + randomNum.toString();
};
