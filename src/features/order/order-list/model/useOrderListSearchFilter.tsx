'use client';

import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import moment from 'moment';
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order';

const useOrderListSearchFilter = () => {
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
    from: moment().subtract(7, 'days').toDate(),
    to: moment().toDate(),
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
      from: moment().format('YYYYMMDD'),
      to: moment().format('YYYYMMDD'),
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
        from: moment().subtract(7, 'days').format('YYYYMMDD'),
        to: moment().format('YYYYMMDD'),
      });
    },
    onMonthClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: moment().subtract(1, 'month').format('YYYYMMDD'),
        to: moment().format('YYYYMMDD'),
      });
    },
    onThreeMonthsClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: moment().subtract(3, 'months').format('YYYYMMDD'),
        to: moment().format('YYYYMMDD'),
      });
    },
    onSixMonthsClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: moment().subtract(6, 'months').format('YYYYMMDD'),
        to: moment().format('YYYYMMDD'),
      });
    },
    onYearClick: () => {
      setFilters({
        pn_keyword: '',
        order_status: null,
        from: moment().subtract(1, 'year').format('YYYYMMDD'),
        to: moment().format('YYYYMMDD'),
      });
    },
  };

  const search = () => {
    setFilters({
      from: moment(date?.from).format('YYYYMMDD'),
      to: moment(date?.to).format('YYYYMMDD'),
      pn_keyword: pnKeyword,
      order_status: orderStatus,
    });
  };

  useEffect(() => {
    setDate({
      from: filters.from ? moment(filters.from).toDate() : moment().subtract(7, 'days').toDate(),
      to: filters.to ? moment(filters.to).toDate() : moment().toDate(),
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
    // filters,
  };
};

export default useOrderListSearchFilter;
