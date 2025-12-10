'use client'

import Navbar from '@order/(page)/_components/Navbar'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { Button, DateRangePicker, Divider, Input } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'
import clsx from 'clsx'
import { parseDate } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import type { DateValue } from '@react-types/datepicker'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { OrderUserInfoContext } from '../../_context/order_context'
import { getOrderList } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatNumberWithCommas } from '../../utils'

export default function OrderListPage() {
  const searchParams = useSearchParams()
  const [defaultFilter, setDefaultFilter] = useState('weekly')
  const [productName, setProductName] = useState('')
  const [date, setDate] = useState<RangeValue<DateValue> | null>(null)
  const [filterdDate, setFilterdDate] = useState<FilterdDateType | null>(null)
  const { user } = useContext(OrderUserInfoContext)

  const { data } = useQuery({
    queryKey: ['order-list'],
    queryFn: () =>
      getOrderList({
        userId: user?.id?.toString() || '',
        start:
          searchParams.get('start') ||
          filterdDate?.[defaultFilter as keyof FilterdDateType]?.start ||
          '',
        end:
          searchParams.get('end') ||
          filterdDate?.[defaultFilter as keyof FilterdDateType]?.end ||
          '',
      }),
    enabled: !!user?.id,
  })

  useEffect(() => {
    const today = new Date()
    const parsedByMomentToday = moment(today).format('YYYY-MM-DD')
    const parsedByMomentSubtract1Week = moment(today).subtract(1, 'week').format('YYYY-MM-DD')
    const parsedByMomentSubtract1Month = moment(today).subtract(1, 'month').format('YYYY-MM-DD')
    const parsedByMomentSubtract3Months = moment(today).subtract(3, 'month').format('YYYY-MM-DD')
    const parsedByMomentSubtract6Months = moment(today).subtract(6, 'month').format('YYYY-MM-DD')
    const parsedByMomentSubtract12Months = moment(today).subtract(12, 'month').format('YYYY-MM-DD')

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
    })
  }, [])

  return (
    <div className="w-full flex flex-col">
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
  )
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center min-h-[calc(100vh-415px)]">
      <div className="w-5xl flex flex-col">{children}</div>
    </div>
  )
}

function ListTitle() {
  return (
    <div className="w-full flex justify-between items-center my-4 pb-4 border-b-2 border-foreground-200">
      <div className="">
        <span className="text-3xl font-bold">주문 내역</span>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/order" className="text-foreground-600">
          상품조회
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand font-bold">주문내역</span>
      </div>
    </div>
  )
}

type FilterdDateType = {
  weekly: {
    start: string
    end: string
  }
  monthly: {
    start: string
    end: string
  }
  threeMonths: {
    start: string
    end: string
  }
  sixmonth: {
    start: string
    end: string
  }
  yearly: {
    start: string
    end: string
  }
}

function ListFilterSection({
  defaultFilter,
  setDefaultFilter,
  productName,
  setProductName,
  date,
  setDate,
  filterdDate,
}: {
  defaultFilter: string
  setDefaultFilter: (filter: string) => void
  productName: string
  setProductName: (name: string) => void
  date: RangeValue<DateValue> | null
  setDate: (date: RangeValue<DateValue> | null) => void
  filterdDate: FilterdDateType | null
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleDetailSearch = () => {
    router.push(
      `/order/list?start=${date?.start?.toString()}&end=${date?.end?.toString()}` +
        (productName ? `&productName=${productName}` : ''),
    )
  }

  return (
    <div className="w-full flex flex-col justify-center items-center my-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ListFilterItem
            dKey={'weekly'}
            value="7일"
            isActive={defaultFilter === 'weekly'}
            filterdDate={filterdDate}
            setDefaultFilter={setDefaultFilter}
          />
          <ListFilterItem
            dKey={'monthly'}
            value="1개월"
            isActive={defaultFilter === 'monthly'}
            filterdDate={filterdDate}
            setDefaultFilter={setDefaultFilter}
          />
          <ListFilterItem
            dKey={'threeMonths'}
            value="3개월"
            isActive={defaultFilter === 'threeMonths'}
            filterdDate={filterdDate}
            setDefaultFilter={setDefaultFilter}
          />
          <ListFilterItem
            dKey={'sixmonth'}
            value="6개월"
            isActive={defaultFilter === 'sixmonth'}
            filterdDate={filterdDate}
            setDefaultFilter={setDefaultFilter}
          />
          <ListFilterItem
            dKey={'yearly'}
            value="1년"
            isActive={defaultFilter === 'yearly'}
            filterdDate={filterdDate}
            setDefaultFilter={setDefaultFilter}
          />
        </div>
        <button
          className="flex gap-1 items-center text-foreground-600 cursor-pointer"
          onClick={handleOpen}
        >
          상세조회 <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-4 w-full mt-4">
          <Divider />
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 w-full items-center">
              <I18nProvider locale="ko">
                <div className="w-1/2">
                  <DateRangePicker label="기간" size="sm" value={date} onChange={setDate} />
                </div>
              </I18nProvider>
              <div className="w-1/2">
                <Input
                  radius="sm"
                  label="상품명"
                  size="sm"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <Button className="bg-brand text-white" radius="sm" onPress={handleDetailSearch}>
                조회하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ListFilterItem({
  dKey,
  value,
  isActive,
  filterdDate,
  setDefaultFilter,
}: {
  dKey: string
  value: string
  isActive: boolean
  filterdDate: FilterdDateType | null
  setDefaultFilter: (filter: string) => void
}) {
  return (
    <Link
      onClick={() => setDefaultFilter(dKey)}
      href={`/order/list?start=${filterdDate?.[dKey as keyof FilterdDateType]?.start}&end=${filterdDate?.[dKey as keyof FilterdDateType]?.end}`}
      prefetch={false}
      className={clsx(
        'px-6 py-1 rounded-full cursor-pointer',
        isActive && 'bg-brand',
        !isActive &&
          'bg-foreground-100 text-foreground-600 border-1 border-foreground-200 hover:bg-foreground-200',
      )}
    >
      <span
        className={clsx('text-sm', isActive && 'text-white', !isActive && 'text-foreground-800')}
      >
        {value}
      </span>
    </Link>
  )
}
// [
//   {
//       "id": 2,
//       "user": {
//           "id": 20,
//           "username": "test0001"
//       },
//       "product": {
//           "id": 8,
//           "name": "브레노솔250mL(백)",
//           "manufacturer": "에스케이케미칼(주)",
//           "price": 7623,
//           "specification": "250mL(백)",
//           "is_best_product": false
//       },
//       "orderCreatedAt": "2025-12-10T05:43:23.000Z",
//       "pgCno": "25121014424310007977",
//       "quantity": 1,
//       "orderStatus": {
//           "id": 1,
//           "name": "상품준비",
//           "updatedAt": "2025-12-10T03:01:14.296Z",
//           "createdAt": "2025-12-10T03:01:14.882Z"
//       },
//       "deliveryCompany": null
//   },
//   {
//       "id": 1,
//       "user": {
//           "id": 20,
//           "username": "test0001"
//       },
//       "product": {
//           "id": 8,
//           "name": "브레노솔250mL(백)",
//           "manufacturer": "에스케이케미칼(주)",
//           "price": 7623,
//           "specification": "250mL(백)",
//           "is_best_product": false
//       },
//       "orderCreatedAt": "2025-12-10T05:33:02.000Z",
//       "pgCno": "25121014322710007943",
//       "quantity": 1,
//       "orderStatus": {
//           "id": 1,
//           "name": "상품준비",
//           "updatedAt": "2025-12-10T03:01:14.296Z",
//           "createdAt": "2025-12-10T03:01:14.882Z"
//       },
//       "deliveryCompany": null
//   }
// ]

function ListTableSection({ data }: { data: OrderListType[] | undefined }) {
  return (
    <div className="flex flex-col w-full gap-4 mt-8">
      <span className="text-xl font-bold">주문내역</span>
      <table>
        <thead>
          <tr className="bg-neutral-100 font-normal text-foreground-700 text-sm">
            <th className="py-2">번호</th>
            <th>주문일시</th>
            <th>제조사</th>
            <th>상품명</th>
            <th>가격</th>
            <th>주문수량</th>
            <th>총 금액</th>
            <th>주문상태</th>
            <th>택배사</th>
            <th>주문취소</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? <ListBody data={data} /> : <ListEmptyBody />}
          {/* <ListEmptyBody /> */}
        </tbody>
      </table>
    </div>
  )
}

type OrderListType = {
  id: number
  user: {
    id: number
    username: string
  }
  product: {
    id: number
    name: string
    manufacturer: string
    specification: string
    price: number
  }
  quantity: number
  orderCreatedAt: string
  pgCno: string
  orderStatus: {
    id: number
    name: string
  }
  deliveryCompany: string | null
}

function ListBody({ data }: { data: OrderListType[] }) {
  return (
    <>
      {data.map((item: OrderListType, index: number) => {
        return (
          <tr key={item.id} className="border-t-1 border-foreground-200 text-sm">
            <td className="text-center py-2">{index + 1}</td>
            <td className="text-center">{moment(item.orderCreatedAt).format('YYYY-MM-DD')}</td>
            <td className="text-center">{item.product.manufacturer}</td>
            <td className="text-center">{item.product.name}</td>
            <td className="text-center">{formatNumberWithCommas(item.product.price)}원</td>
            <td className="text-center">{item.quantity}</td>
            <td className="text-center">
              {formatNumberWithCommas(item.product.price * item.quantity)}원
            </td>
            <td className="text-center">
              <div className="mx-auto w-fit bg-neutral-200 px-2 py-1 rounded-md">
                <span className="text-xs text-foreground-700">{item.orderStatus.name}</span>
              </div>
            </td>
            <td className="text-center">{item.deliveryCompany || '-'}</td>
            <td className="text-center">
              <div className="mx-auto w-fit">
                <button className="bg-danger-500 text-white px-2 py-1 rounded-md cursor-pointer text-xs">
                  주문취소
                </button>
              </div>
            </td>
          </tr>
        )
      })}
    </>
  )
}
function ListEmptyBody() {
  return (
    <tr>
      <td
        colSpan={10}
        className="text-center py-[200px] border-1 border-t-none border-foreground-200 text-foreground-600"
      >
        주문내역이 없습니다.
      </td>
    </tr>
  )
}
