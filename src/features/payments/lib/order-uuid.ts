/**
 * order에 사용하는 orderNo를 생성합니다.
 *
 * @example
 * ```ts
 * const orderNo = generateShopOrderNo();
 * console.log(orderNo); // '202604071234567890'
 * ```
 */
export const generateShopOrderNo = () => {
  const now = new Date();
  const yyyymmdd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000000 + Math.random() * 9000000); // 7자리 랜덤 숫자

  return yyyymmdd + randomNum.toString();
};
