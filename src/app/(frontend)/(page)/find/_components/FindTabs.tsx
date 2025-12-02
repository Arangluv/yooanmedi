'use client'

import { Tabs, Tab } from '@heroui/react'
import { User, Lock } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function FindTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get('type')

  return (
    <div className="w-full flex items-center justify-center">
      <Tabs color="primary" defaultSelectedKey={type ?? 'id'} selectedKey={type ?? 'id'} size="lg">
        <Tab key="id" title={<FindIdTitle />} onClick={() => router.push('/find?type=id')}></Tab>
        <Tab
          key="password"
          title={<FindPasswordTitle />}
          onClick={() => router.push('/find?type=password')}
        ></Tab>
      </Tabs>
    </div>
  )
}

function FindIdTitle() {
  return (
    <div className="flex gap-2 items-center">
      <User className="w-4 h-4" />
      <span>아이디 찾기</span>
    </div>
  )
}

function FindPasswordTitle() {
  return (
    <div className="flex gap-2 items-center">
      <Lock className="w-4 h-4" />
      <span>비밀번호 재설정</span>
    </div>
  )
}
