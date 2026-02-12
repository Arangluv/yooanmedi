import moment from 'moment-timezone';

const SEOUL_TZ = 'Asia/Seoul';

export const getNowYYYYMMDD = () => {
  return moment.tz(SEOUL_TZ).format('YYYYMMDD');
};

// TODO :: payment로 이동
export const transformApprovalDateToISOString = (approvalDate: string) => {
  return moment.tz(approvalDate, 'YYYYMMDDHHmmss', SEOUL_TZ).toISOString();
};

export const getNowISOString = () => {
  return moment.tz(SEOUL_TZ).toISOString();
};
