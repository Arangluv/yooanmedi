import moment from 'moment-timezone';

const SEOUL_TZ = 'Asia/Seoul';

export const getNowYYYYMMDD = () => {
  return moment.tz(SEOUL_TZ).format('YYYYMMDD');
};

export const getNowISOString = () => {
  return moment.tz(SEOUL_TZ).toISOString();
};
