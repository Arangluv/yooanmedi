'use client';

import { Tabs, Tab } from '@heroui/react';
import { User, Lock } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function FindTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // TODO :: 타입 개선
  const type = (searchParams as any).get('type');

  return (
    <div className="flex w-full items-center justify-center">
      <Tabs color="primary" defaultSelectedKey={type ?? 'id'} selectedKey={type ?? 'id'} size="lg">
        <Tab key="id" title={<FindIdTitle />} onClick={() => router.push('/find?type=id')}></Tab>
        <Tab
          key="password"
          title={<FindPasswordTitle />}
          onClick={() => router.push('/find?type=password')}
        ></Tab>
      </Tabs>
    </div>
  );
}

function FindIdTitle() {
  return (
    <div className="flex items-center gap-2">
      <User className="h-4 w-4" />
      <span>아이디 찾기</span>
    </div>
  );
}

function FindPasswordTitle() {
  return (
    <div className="flex items-center gap-2">
      <Lock className="h-4 w-4" />
      <span>비밀번호 재설정</span>
    </div>
  );
}
