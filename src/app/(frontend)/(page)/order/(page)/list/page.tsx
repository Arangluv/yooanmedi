'use client';

import Navbar from '@/app/(frontend)/(page)/order/(page)/_components/Navbar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import type { RangeValue } from '@react-types/shared';
import type { DateValue } from '@react-types/datepicker';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import { OrderUserInfoContext } from '../../_context/order_context';
import { getOrderList } from './actions';
import { useSearchParams } from 'next/navigation';
import ListFilterSection from './_components/ListFilterSection';
import { OrderListType } from './_components/ListBodySection';
import { ListBodySection, ListEmptyBody } from './_components/ListBodySection';
import OrderListExportButton from './_components/OrderListExportButton';

type FilterdDateType = {
  weekly: {
    start: string;
    end: string;
  };
  monthly: {
    start: string;
    end: string;
  };
  threeMonths: {
    start: string;
    end: string;
  };
  sixmonth: {
    start: string;
    end: string;
  };
  yearly: {
    start: string;
    end: string;
  };
};

export default function OrderListPage() {
  const searchParams = useSearchParams();
  const [defaultFilter, setDefaultFilter] = useState('weekly');
  const [productName, setProductName] = useState('');
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null);
  const [filterdDate, setFilterdDate] = useState<FilterdDateType | null>(null);
  const { user } = useContext(OrderUserInfoContext);

  const start =
    searchParams.get('start') || filterdDate?.[defaultFilter as keyof FilterdDateType]?.start || '';
  const end =
    searchParams.get('end') || filterdDate?.[defaultFilter as keyof FilterdDateType]?.end || '';
  const prodNameSearchParam = searchParams.get('productName') || '';

  const { data } = useQuery({
    queryKey: ['order-list', start, end, prodNameSearchParam],
    queryFn: () =>
      getOrderList({
        userId: user?.id?.toString() || '',
        start: start,
        end: end,
        productName: prodNameSearchParam,
      }),
    enabled: !!user?.id && !!start && !!end,
  });

  useEffect(() => {
    const today = new Date();
    const parsedByMomentToday = moment(today).format('YYYY-MM-DD');
    const parsedByMomentSubtract1Week = moment(today).subtract(1, 'week').format('YYYY-MM-DD');
    const parsedByMomentSubtract1Month = moment(today).subtract(1, 'month').format('YYYY-MM-DD');
    const parsedByMomentSubtract3Months = moment(today).subtract(3, 'month').format('YYYY-MM-DD');
    const parsedByMomentSubtract6Months = moment(today).subtract(6, 'month').format('YYYY-MM-DD');
    const parsedByMomentSubtract12Months = moment(today).subtract(12, 'month').format('YYYY-MM-DD');

    setFilterdDate({
      weekly: {
        start: parsedByMomentSubtract1Week,
        end: parsedByMomentToday,
      },
      monthly: {
        start: parsedByMomentSubtract1Month,
        end: parsedByMomentToday,
      },
      threeMonths: {
        start: parsedByMomentSubtract3Months,
        end: parsedByMomentToday,
      },
      sixmonth: {
        start: parsedByMomentSubtract6Months,
        end: parsedByMomentToday,
      },
      yearly: {
        start: parsedByMomentSubtract12Months,
        end: parsedByMomentToday,
      },
    });
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <ContentWrapper>
        <ListTitle />
        <ListFilterSection
          defaultFilter={defaultFilter}
          setDefaultFilter={setDefaultFilter}
          productName={productName}
          setProductName={setProductName}
          date={date}
          setDate={setDate}
          filterdDate={filterdDate}
        />
        <ListTableSection data={data as OrderListType[] | undefined} />
      </ContentWrapper>
    </div>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
      <div className="flex w-5xl flex-col">{children}</div>
    </div>
  );
}

function ListTitle() {
  return (
    <div className="border-foreground-200 my-4 flex w-full items-center justify-between border-b-2 pb-4">
      <div className="">
        <span className="text-3xl font-bold">주문 내역</span>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/order" className="text-foreground-600">
          상품조회
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-brand font-bold">주문내역</span>
      </div>
    </div>
  );
}

function ListTableSection({ data }: { data: OrderListType[] | undefined }) {
  return (
    <div className="mt-8 flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">주문내역</span>
        <OrderListExportButton data={data as OrderListType[]} />
      </div>
      <table>
        <thead>
          <tr className="text-foreground-700 bg-neutral-100 text-sm font-normal">
            <th className="py-2">번호</th>
            <th>주문일시</th>
            <th>제조사</th>
            <th>상품명</th>
            <th>가격</th>
            <th>주문수량</th>
            <th>총 금액</th>
            <th>주문상태</th>
            <th>주문취소</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? <ListBodySection data={data} /> : <ListEmptyBody />}
        </tbody>
      </table>
    </div>
  );
}
