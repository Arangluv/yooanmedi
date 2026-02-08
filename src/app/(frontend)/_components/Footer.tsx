import Link from 'next/link';
import { BrandLogo } from '@/shared';
import { Landmark } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 flex w-full items-center justify-center bg-neutral-50 py-8">
      <div className="flex w-full max-w-7xl flex-col gap-4">
        {/* footer top */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-[40px] w-[140px]">
              <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
            </div>
            <span className="text-foreground-600 text-[13px]">
              Made by{' '}
              <Link
                href="https://classy-web.com/"
                className="text-brand font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Classyweb
              </Link>
            </span>
          </div>
          {/* navigation 영역 */}
          {/* TODO:: 내비게이션 링크 수정해야함 */}
        </div>

        {/* footer middle */}
        <div className="mt-6 flex w-full items-end justify-between">
          {/* left 영역 */}
          <div className="flex w-full flex-col gap-1">
            <div className="flex">
              <div className="flex flex-shrink-0 flex-col gap-1">
                <div className="text-foreground-600 flex gap-3 text-[13px]">
                  <span>회사 : (주)유안메디팜</span>
                  <span>대표 : 심광규</span>
                </div>
                <div className="text-foreground-600 flex gap-3 text-[13px]">
                  <span>사업자등록번호 : 430-86-03013</span>
                  <span>이메일 : yooanmedi@gmail.com</span>
                </div>
                <div className="text-foreground-600 flex gap-3 text-[13px]">
                  <span>주소 : 경기도 수원시 권선구 금곡로196번길 102, 203호</span>
                  <span>전화 : 031-893-0806</span>
                  <span>FAX : 031-893-0809</span>
                </div>
                <div className="text-foreground-600 flex gap-3 text-[13px]">
                  <span>본 사이트에 게시된 정보를 무단으로 수집되는 것을 거부합니다</span>
                </div>
              </div>
              <div className="flex w-full flex-col items-end justify-end">
                <span className="flex items-center gap-1 text-[15px] font-bold">
                  <Landmark className="h-4 w-4" strokeWidth={1.5} />
                  무통장 입금 계좌정보
                </span>
                <div className="text-brand mt-2 flex gap-1 text-[15px]">
                  <span>유안메디팜</span>
                  <span>·</span>
                  <span>우리은행</span>
                  <span>·</span>
                  <span>1005-504-652055</span>
                </div>
                <div></div>
              </div>
            </div>
            <div className="mt-8 flex w-full items-center justify-between">
              <span className="text-foreground-600 text-[13px]">
                Copyright © 유안메디. All rights reserved.
              </span>
              <ul className="flex items-center gap-4">
                <li>
                  <Link
                    href="/terms?type=terms"
                    className="text-foreground-600 hover:text-foreground-800 text-sm transition-colors duration-300"
                  >
                    <span>이용약관</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms?type=privacy"
                    className="text-foreground-500 hover:text-foreground-800 text-sm transition-colors duration-300"
                  >
                    <span>개인정보처리방침</span>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/"
                    className="text-sm text-foreground-500 hover:text-foreground-800 transition-colors duration-300"
                  >
                    <span>공지사항</span>
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
