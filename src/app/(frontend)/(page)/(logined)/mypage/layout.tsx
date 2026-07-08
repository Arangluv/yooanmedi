import React from 'react';
import Link from 'next/link';
import { Header } from '@/widget/Header';
import { Separator } from '@/shared/ui/shadcn';

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-5xl flex-col gap-8">
        <Header></Header>
        <div className="flex w-full gap-8">
          <nav className="mr-4 flex h-full shrink-0 flex-col gap-4">
            <Link href={'/order'} className="text-muted-foreground/80 hover:text-primary text-lg">
              HOME
            </Link>
            <Separator />
            <div className="flex flex-col gap-2 pr-4">
              <h4 className="text-lg">내정보관리</h4>
              <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
                <li>
                  <Link href="/mypage/info" className="hover:text-secondary">
                    내 정보 관리
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/modify-password" className="hover:text-secondary">
                    비밀번호 관리
                  </Link>
                </li>
              </ul>
            </div>
            <Separator />
          </nav>
          <main className="w-full">
            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">마이페이지</h3>
                <span className="text-muted-foreground text-sm">
                  고객님의 개인정보는 안전하게 보호되고 있습니다
                </span>
                <Separator className="my-2" />
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyPageLayout;
