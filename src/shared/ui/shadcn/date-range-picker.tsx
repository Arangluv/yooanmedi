'use client';

import { useEffect, useState } from 'react';

import moment from 'moment';
import { type DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import { ko } from 'date-fns/locale';

import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverTrigger, PopoverContent } from './popover';

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

const DateRangePicker = ({ date, setDate }: DateRangePickerProps) => {
  const [timeZone, setTimeZone] = useState<string | undefined>('Asia/Seoul');

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-range"
          className="justify-start px-2.5 font-normal"
        >
          <CalendarIcon
            data-icon="inline-start"
            className="text-foreground-500"
            strokeWidth={1.5}
          />
          {date?.from ? (
            date.to ? (
              <>
                {moment(date.from).format('YYYY-MM-DD')} ~ {moment(date.to).format('YYYY-MM-DD')}
              </>
            ) : (
              moment(date.from).format('YYYY-MM-DD')
            )
          ) : (
            <span>날짜를 선택해주세요.</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" timeZone={timeZone} selected={date} onSelect={setDate} locale={ko} />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
