'use client';

import { User as UserIcon, Lock as LockIcon } from 'lucide-react';
import { Tabs, TabsTrigger, TabsList } from '@/shared/ui/navigation';
import { useRouter } from 'next/navigation';
import { PageType, PAGE_TYPE } from '../constants';

type Props = {
  pageType: PageType;
};

export const FindAuthInfoTabs = ({ pageType }: Props) => {
  const router = useRouter();

  return (
    <Tabs defaultValue={pageType}>
      <TabsList>
        <TabsTrigger value={PAGE_TYPE.id} onClick={() => router.push(`/find?type=${PAGE_TYPE.id}`)}>
          <UserIcon />
          아이디 찾기
        </TabsTrigger>
        <TabsTrigger
          value={PAGE_TYPE.password}
          onClick={() => router.push(`/find?type=${PAGE_TYPE.password}`)}
        >
          <LockIcon />
          비밀번호 재설정
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
