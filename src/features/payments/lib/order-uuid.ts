export const orderUuid = () => {
  const now = new Date();
  const yyyymmdd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000000 + Math.random() * 9000000); // 7자리 랜덤 숫자

  return yyyymmdd + randomNum.toString();
};
