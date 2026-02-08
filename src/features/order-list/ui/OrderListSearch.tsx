'use client';

import { useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { Divider } from '@heroui/react';
import type { DateRange } from 'react-day-picker';
import { I18nProvider } from '@react-aria/i18n'; // TODO :: 삭제

import { Input } from '@/shared/ui/shadcn/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/shared/ui/shadcn/select';
import { Button } from '@/shared/ui/shadcn/button';
import DateRangePicker from '@/shared/ui/shadcn/date-range-picker';
import { ORDER_STATUS_NAME } from '@/entities/order';
import { cn } from '@/shared';

import useOrderListSearchFilter from '../model/useOrderListSearchFilter';

const OrderListSearch = () => {
  const [openDetailOptions, setOpenDetailOptions] = useState(false);
  const {
    updateDate,
    updatePnKeyword,
    updateOrderStatus,
    searchOptions,
    date,
    pnKeyword,
    orderStatus,
    search,
  } = useOrderListSearchFilter();

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-md bg-neutral-50 p-4">
      <div className="flex w-full items-center justify-between">
        <DateRangeOptions searchOptions={searchOptions} />
        <button
          className="text-foreground-600 flex cursor-pointer items-center gap-1"
          onClick={() => setOpenDetailOptions(!openDetailOptions)}
        >
          상세조회 <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      {openDetailOptions && (
        <SearchDetailOptions
          updateDate={updateDate}
          updatePnKeyword={updatePnKeyword}
          updateOrderStatus={updateOrderStatus}
          search={search}
          date={date}
          pnKeyword={pnKeyword}
          orderStatus={orderStatus}
        />
      )}
    </div>
  );
};

const DateRangeOptions = ({
  searchOptions,
}: {
  searchOptions: {
    onWeekClick: () => void;
    onMonthClick: () => void;
    onThreeMonthsClick: () => void;
    onSixMonthsClick: () => void;
    onYearClick: () => void;
  };
}) => {
  const [selectedOption, setSelectedOption] = useState('weekly');
  const DateRangeOptionItem = ({
    title,
    isSelected,
    onClick,
  }: {
    title: string;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    return (
      <button
        className={cn(
          'cursor-pointer rounded-full border border-neutral-200 bg-white px-6 py-1',
          isSelected && 'bg-brand text-white',
        )}
        onClick={onClick}
      >
        <span className="text-sm">{title}</span>
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <DateRangeOptionItem
        title="7일"
        isSelected={selectedOption === 'weekly'}
        onClick={() => {
          setSelectedOption('weekly');
          searchOptions.onWeekClick();
        }}
      />
      <DateRangeOptionItem
        title="1개월"
        isSelected={selectedOption === 'monthly'}
        onClick={() => {
          setSelectedOption('monthly');
          searchOptions.onMonthClick();
        }}
      />
      <DateRangeOptionItem
        title="3개월"
        isSelected={selectedOption === 'threeMonths'}
        onClick={() => {
          setSelectedOption('threeMonths');
          searchOptions.onThreeMonthsClick();
        }}
      />
      <DateRangeOptionItem
        title="6개월"
        isSelected={selectedOption === 'sixMonths'}
        onClick={() => {
          setSelectedOption('sixMonths');
          searchOptions.onSixMonthsClick();
        }}
      />
      <DateRangeOptionItem
        title="1년"
        isSelected={selectedOption === 'yearly'}
        onClick={() => {
          setSelectedOption('yearly');
          searchOptions.onYearClick();
        }}
      />
    </div>
  );
};

const SearchDetailOptions = ({
  updateDate,
  updatePnKeyword,
  updateOrderStatus,
  search,
  date,
  pnKeyword,
  orderStatus,
}: {
  updateDate: (date: DateRange | undefined) => void;
  updatePnKeyword: (keyword: string) => void;
  updateOrderStatus: (status: keyof typeof ORDER_STATUS_NAME | null) => void;
  search: () => void;
  date: DateRange | undefined;
  pnKeyword: string;
  orderStatus: keyof typeof ORDER_STATUS_NAME | null;
}) => {
  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      <Divider />
      <div className="flex w-full flex-col gap-2">
        <form
          className="flex w-full items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <DateRangePicker
            onChange={updateDate}
            defaultDate={{ from: date?.from ?? new Date(), to: date?.to ?? new Date() }}
          />
          <Select
            defaultValue={orderStatus?.toString() ?? 'all'}
            value={orderStatus?.toString() ?? 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                updateOrderStatus(null);
              } else {
                updateOrderStatus(parseInt(value) as keyof typeof ORDER_STATUS_NAME);
              }
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="주문상태" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="all">전체</SelectItem>
                {Object.entries(ORDER_STATUS_NAME).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            defaultValue={pnKeyword}
            placeholder="상품명을 입력해주세요."
            className="w-[250px] bg-white"
            value={pnKeyword}
            onChange={(e) => updatePnKeyword(e.target.value)}
          />
          <Button className="bg-brand hover:bg-brandWeek cursor-pointer text-white" type="submit">
            조회하기
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderListSearch;
