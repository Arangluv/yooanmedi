import { v4 as uuidv4 } from 'uuid';

/**
 * @description 20자리 랜덤 UUID 생성합니다 (hyphen 제거, 대문자로 변환)
 * @description 결제승인 시 트랜잭션 ID로 사용할 수 있습니다
 * @example
 * ```ts
 * const uuid = getUuidWithoutHyphen();
 * console.log(uuid); // '02D5F86034E54F4DB06FC5F7FF454121'
 * ```
 */
export const getUuidWithoutHyphen = () => {
  const uuid = uuidv4();

  return uuid.split('-').join('').toUpperCase();
};
