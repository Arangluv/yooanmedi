import moment from 'moment-timezone';

const SEOUL_TZ = 'Asia/Seoul';

export const getNowYYYYMMDD = () => {
  return moment.tz(SEOUL_TZ).format('YYYYMMDD');
};

export const transformApprovalDateToISOString = (approvalDate: string) => {
  return moment.tz(approvalDate, 'YYYYMMDDHHmmss', SEOUL_TZ).toISOString();
};
