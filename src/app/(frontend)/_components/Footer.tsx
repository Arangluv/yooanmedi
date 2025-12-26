import Link from 'next/link'
import { BrandLogo } from '@/config/Logo'
import { Landmark } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center bg-neutral-50 py-8 mt-8">
      <div className="w-full max-w-7xl flex flex-col gap-4">
        {/* footer top */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="w-[140px] h-[40px]">
              <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
            </div>
            <span className="text-[13px] text-foreground-600">
              Made by{' '}
              <Link
                href="https://classy-web.com/"
                className="font-bold text-brand"
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
        <div className="w-full flex justify-between mt-6 items-end">
          {/* left 영역 */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <div className="flex gap-3 text-[13px] text-foreground-600">
                  <span>회사 : (주)유안메디팜</span>
                  <span>대표 : 심광규</span>
                </div>
                <div className="flex gap-3 text-[13px] text-foreground-600">
                  <span>사업자등록번호 : 430-86-03013</span>
                  <span>이메일 : yooanmedi@gmail.com</span>
                </div>
                <div className="flex gap-3 text-[13px] text-foreground-600">
                  <span>주소 : 경기도 수원시 권선구 금곡로196번길 102, 203호</span>
                  <span>전화 : 031-893-0806</span>
                  <span>FAX : 031-893-0809</span>
                </div>
                <div className="flex gap-3 text-[13px] text-foreground-600">
                  <span>본 사이트에 게시된 정보를 무단으로 수집되는 것을 거부합니다</span>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end w-full">
                <span className="text-[15px] font-bold flex items-center gap-1">
                  <Landmark className="w-4 h-4" strokeWidth={1.5} />
                  무통장 입금 계좌정보
                </span>
                <div className="flex text-brand text-[15px] gap-1 mt-2">
                  <span>유안메디팜</span>
                  <span>·</span>
                  <span>우리은행</span>
                  <span>·</span>
                  <span>1005-504-652055</span>
                </div>
                <div></div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-8">
              <span className="text-[13px] text-foreground-600">
                Copyright © 유안메디. All rights reserved.
              </span>
              <ul className="flex gap-4 items-center">
                <li>
                  <Link
                    href="/terms?type=terms"
                    className="text-sm text-foreground-600 hover:text-foreground-800 transition-colors duration-300"
                  >
                    <span>이용약관</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms?type=privacy"
                    className="text-sm text-foreground-500 hover:text-foreground-800 transition-colors duration-300"
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
  )
}
