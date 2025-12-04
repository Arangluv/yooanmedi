'use client'
import { Input, Select, SelectItem } from '@heroui/react'
import clsx from 'clsx'
import { Search } from 'lucide-react'
const temp = [
  {
    key: 'productName',
    label: '상품명',
  },
  {
    key: 'companyName',
    label: '제약사명',
  },
]

type Temp = {
  key: string
  label: string
}

export default function SearchForm() {
  // 상품명 or 제약사명
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] flex">
      <Select
        defaultSelectedKeys={[temp[0].key]}
        radius="sm"
        variant="bordered"
        classNames={{
          base: 'w-[20%]',
          trigger: 'border-1 border-brandWeek rounded-r-none border-r-0 text-sm',
          innerWrapper: '&:is(:where(.group)[data-has-value="true"] *):text-foreground-600',
        }}
        renderValue={(items: any) => {
          return <span className="text-sm text-foreground-700">{items[0].textValue}</span>
        }}
      >
        {temp.map((item) => (
          <SelectItem key={item.key} classNames={{ title: 'text-sm text-foreground-800' }}>
            {item.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        radius="sm"
        disableAnimation={true}
        variant="bordered"
        classNames={{
          base: 'w-[80%]',
          inputWrapper: clsx(
            'border-1 border-brandWeek rounded-l-none border-l-0',
            'data-[hover=true]:border-brandWeekWeek',
            'data-[focus=true]:border-brandWeekWeek',
            'data-[focus-within=true]:border-brandWeekWeek',
            'data-[focus-visible=true]:border-brandWeekWeek',
          ),
        }}
        placeholder="검색어를 입력해주세요."
        endContent={<Search className="w-5 h-5 text-brandWeek" />}
      />
    </div>
  )
}
