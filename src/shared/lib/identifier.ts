import { v4 as uuidv4 } from 'uuid';

/**
 * @description 32자리 랜덤 UUID 생성합니다 (hyphen 제거, 대문자로 변환)
 * @description 결제승인 시 트랜잭션 ID로 사용할 수 있습니다
 * @example
 * ```ts
 * const uuid = getUuidWithoutHyphen();
 * console.log(uuid); // '02D5F86034E54F4DB06FC5F7FF454121'
 * ```
 */
export const generateUUID32digits = () => {
  const uuid = uuidv4();

  return uuid.split('-').join('').toUpperCase();
};

/**
 * @description 15자리 숫자를 반환합니다.
 * @example
 * ```ts
 * const number = generate20digitsNumberBasedOnDate();
 * console.log(number); // '202604071234567890'
 * ```
 */
export const generate20digitsNumberBasedOnDate = () => {
  const now = new Date();
  const yyyymmdd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000000 + Math.random() * 9000000); // 7자리 랜덤 숫자

  return yyyymmdd + randomNum.toString();
};
