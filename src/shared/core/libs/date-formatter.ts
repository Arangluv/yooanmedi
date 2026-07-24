import dayjs from 'dayjs';

export class DateFormatter {
  // string은 다음과 같은 인수를 받을 수 있습니다
  // iso string, yyyymmdd, yyyymmddhhmmss -> yyyymmdd
  static withYYYYMMDD(date: string | Date): string {
    const formattedDateString = dayjs(date).format('YYYYMMDD');

    return formattedDateString === 'Invalid Date'
      ? '날짜 형식이 올바르지 않습니다'
      : formattedDateString;
  }

  static withCustomFormat(date: string | Date, formatter: string = 'YYYYMMDD'): string {
    const formattedDateString = dayjs(date).format(formatter);

    return formattedDateString === 'Invalid Date'
      ? '날짜 형식이 올바르지 않습니다'
      : formattedDateString;
  }
}
