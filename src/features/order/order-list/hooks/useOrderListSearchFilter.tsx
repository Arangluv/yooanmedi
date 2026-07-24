'use client';

import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import moment from 'moment';
import dayjs from 'dayjs';
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order';

export const useOrderListSearchFilter = () => {
  const [filters, setFilters] = useQueryStates(
    {
      from: parseAsString,
      to: parseAsString,
      pn_keyword: parseAsString.withDefault(''),
      order_status: parseAsStringEnum<keyof typeof ORDER_STATUS_NAME>(Object.values(ORDER_STATUS)),
    },
    {
      history: 'push',
      shallow: false,
    },
  );

  const [date, setDate] = useState<DateRange | undefined>({
    from: dayjs().subtract(7, 'days').toDate(),
    to: dayjs().toDate(),
  });
  const [pnKeyword, setPnKeyword] = useState<string>(filters.pn_keyword);
  const [orderStatus, setOrderStatus] = useState<keyof typeof ORDER_STATUS_NAME | null>(
    filters.order_status,
  );

  const updateDate = (date: DateRange | undefined) => {
    setDate(date);
  };

  const updatePnKeyword = (keyword: string) => {
    setPnKeyword(keyword);
  };

  const updateOrderStatus = (status: keyof typeof ORDER_STATUS_NAME | null) => {
    setOrderStatus(status);
  };

  const resetFilters = () => {
    setFilters({
      from: dayjs().format('YYYYMMDD'),
      to: dayjs().format('YYYYMMDD'),
      pn_keyword: '',
      order_status: null,
    });

    setPnKeyword('');
    setOrderStatus(null);
  };

  const searchOptions = {
    onWeekClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: dayjs().subtract(7, 'days').format('YYYYMMDD'),
        to: dayjs().format('YYYYMMDD'),
      });
    },
    onMonthClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: dayjs().subtract(1, 'month').format('YYYYMMDD'),
        to: dayjs().format('YYYYMMDD'),
      });
    },
    onThreeMonthsClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: dayjs().subtract(3, 'months').format('YYYYMMDD'),
        to: dayjs().format('YYYYMMDD'),
      });
    },
    onSixMonthsClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: dayjs().subtract(6, 'months').format('YYYYMMDD'),
        to: dayjs().format('YYYYMMDD'),
      });
    },
    onYearClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: dayjs().subtract(1, 'year').format('YYYYMMDD'),
        to: dayjs().format('YYYYMMDD'),
      });
    },
  };

  const search = () => {
    setFilters({
      from: dayjs(date?.from).format('YYYYMMDD'),
      to: dayjs(date?.to).format('YYYYMMDD'),
      pn_keyword: pnKeyword,
      order_status: orderStatus,
    });
  };

  useEffect(() => {
    setDate({
      from: filters.from ? dayjs(filters.from).toDate() : dayjs().subtract(7, 'days').toDate(),
      to: filters.to ? dayjs(filters.to).toDate() : dayjs().toDate(),
    });
    setPnKeyword(filters.pn_keyword ?? '');
    setOrderStatus(filters.order_status ?? null);
  }, [filters]);

  return {
    updateDate,
    updatePnKeyword,
    updateOrderStatus,
    resetFilters,
    search,
    searchOptions,
    date,
    pnKeyword,
    orderStatus,
  };
};
