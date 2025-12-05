'use client'

import { Tabs, Tab } from '@heroui/react'

export default function CategoryNav() {
  return (
    <Tabs
      variant="underlined"
      size="lg"
      classNames={{
        tabList: 'p-0',
      }}
    >
      <Tab key="all" title="전체"></Tab>
      <Tab key="medicine" title="의약품"></Tab>
      <Tab key="injection" title="주사"></Tab>
      <Tab key="cosmetic" title="에스테틱"></Tab>
      <Tab key="equipment" title="기기/용품"></Tab>
      <Tab key="liquid" title="수액"></Tab>
    </Tabs>
  )
}
