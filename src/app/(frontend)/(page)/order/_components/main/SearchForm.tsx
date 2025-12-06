'use client'
import { button, Form, Input, Select, SelectItem } from '@heroui/react'
import clsx from 'clsx'
import { Search } from 'lucide-react'
import { generateQueryString } from '@order/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchParamsType } from '@order/_type'

const searchCondition = [
  {
    key: 'pn',
    label: '상품명',
  },
  {
    key: 'cn',
    label: '제약사명',
  },
]

export default function SearchForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const condition = formData.get('condition') as string
    const keyword = formData.get('keyword') as string

    const query = generateQueryString({
      searchParams,
      condition,
      keyword,
    }) as SearchParamsType
    router.push(`/order?${query}`)
  }
  return (
    <Form
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] flex flex-row gap-0"
      onSubmit={onSubmit}
    >
      <Select
        defaultSelectedKeys={[searchParams.get('condition') ?? searchCondition[0].key]}
        radius="sm"
        name="condition"
        variant="bordered"
        aria-label="검색 조건"
        classNames={{
          base: 'w-[20%]',
          trigger:
            'border-1 border-brandWeek rounded-r-none border-r-0 text-sm data-[hover=true]:border-brandWeekWeek data-[open=true]:border-brandWeekWeek',
        }}
        renderValue={(items: any) => {
          return <span className="text-sm text-foreground-700">{items[0].textValue}</span>
        }}
      >
        {searchCondition.map((item) => (
          <SelectItem key={item.key} classNames={{ title: 'text-sm text-foreground-800' }}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        radius="sm"
        name="keyword"
        disableAnimation={true}
        variant="bordered"
        aria-label="검색어"
        defaultValue={searchParams.get('keyword') ?? ''}
        classNames={{
          base: 'w-[80%]',
          inputWrapper: clsx(
            'border-1 border-brandWeek rounded-l-none border-l-0',
            'data-[hover=true]:border-brandWeekWeek',
            'group-data-[focus=true]:border-brandWeekWeek',
          ),
        }}
        placeholder="검색어를 입력해주세요."
        endContent={
          <button type="submit">
            <Search className="w-5 h-5 text-brandWeek cursor-pointer" />
          </button>
        }
      />
    </Form>
  )
}
