import moment from 'moment-timezone';

const momentSeoul = moment.tz('Asia/Seoul');

export const getNowYYYYMMDD = () => {
  return momentSeoul.format('YYYYMMDD');
};
