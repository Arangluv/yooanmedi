import moment from 'moment-timezone';

const SEOUL_TZ = 'Asia/Seoul';

export const getNowYYYYMMDD = () => {
  return moment.tz(SEOUL_TZ).format('YYYYMMDD');
};

/**
 * @example
 * ```ts
 * const date = getNowISOString();
 * console.log(date); // '2026-04-17T03:58:04.806Z'
 * ```
 */
export const getNowISOString = () => {
  return moment.tz(SEOUL_TZ).toISOString();
};
