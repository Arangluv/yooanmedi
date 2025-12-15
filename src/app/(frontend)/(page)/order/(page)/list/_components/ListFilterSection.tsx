'use client'

import type { RangeValue } from '@react-types/shared'
import type { DateValue } from '@react-types/datepicker'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Divider } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'
import { Input, Button, DateRangePicker } from '@heroui/react'
import Link from 'next/link'
import clsx from 'clsx'

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

export default function ListFilterSection({
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
    const params = new URLSearchParams()

    // date가 설정되어 있으면 그 값을 사용
    if (date?.start && date?.end) {
      params.set('start', date.start.toString())
      params.set('end', date.end.toString())
    }

    // productName이 있으면 추가
    if (productName) {
      params.set('productName', productName)
    }

    router.push(`/order/list?${params.toString()}`)
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleDetailSearch()
                    }
                  }}
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
