'use client'

import { Tabs, Tab } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchParamsType } from '../../_type'
import { generateQueryString } from '../../utils'
import { useQuery } from '@tanstack/react-query'
import { getProductsCategory } from '../../actions'

export default function CategoryNav() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: productsCategory } = useQuery({
    queryKey: ['productsCategory'],
    queryFn: getProductsCategory,
  })

  const onTabClick = (key: string) => {
    const query = generateQueryString({
      searchParams,
      category: key,
    }) as SearchParamsType

    router.push(`/order?${query}`)
  }

  if (!productsCategory || productsCategory.length === 0) {
    return null
  }

  return (
    <Tabs
      variant="underlined"
      size="lg"
      classNames={{
        tabList: 'p-0',
      }}
      defaultSelectedKey={searchParams.get('category') ?? 'all'}
    >
      <Tab key="all" title="전체" onClick={() => onTabClick('all')}></Tab>
      {productsCategory.map((category) => (
        <Tab
          key={category.id}
          title={category.name}
          onClick={() => onTabClick(String(category.id))}
        ></Tab>
      ))}
    </Tabs>
  )
}
