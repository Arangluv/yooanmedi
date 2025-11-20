'use client'

import Link from 'next/link'
import { InfoIcon } from 'lucide-react'
import Image from 'next/image'
import { LogoContext } from '@/context/design_contexts'
import { useContext } from 'react'

export default function Footer() {
  const { logoImage } = useContext(LogoContext)

  return (
    <footer className="w-full flex items-center justify-center bg-neutral-50 py-8 mt-8">
      <div className="w-full max-w-7xl flex flex-col gap-4">
        {/* footer top */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="w-[140px] h-[40px]">
              <Image
                src={logoImage}
                alt="로고이미지"
                unoptimized
                width={140}
                height={40}
                className="w-full h-full object-cover"
              />
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
            <li>
              <Link
                href="/"
                className="text-sm text-foreground-500 hover:text-foreground-800 transition-colors duration-300"
              >
                <span>공지사항</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* footer middle */}
        <div className="w-full flex justify-between mt-6 items-end">
          {/* left 영역 */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 text-[13px] text-foreground-600">
              <span>회사 : 유안메디팜</span>
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
            <div className="flex gap-3 text-[13px] text-foreground-600 mt-8">
              <span>Copyright © 유안메디. All rights reserved.</span>
            </div>
          </div>
          {/* right 영역 */}
          <div className="flex flex-col h-full justify-between gap-8">
            <div className="flex gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-[15px] text-foreground-700 font-bold">영업시간</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] text-foreground-600">평일 09:00 - 18:00</span>
                  <span className="text-[13px] text-foreground-600">점심시간 12:00 - 13:00</span>
                  <span className="text-[13px] text-foreground-600">(주말 및 공휴일 휴무)</span>
                </div>
              </div>
            </div>
            <div className="bg-neutral-100 w-[300px] p-4 rounded-md flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <InfoIcon className="w-4 h-4 text-brandWeek" />
                <span className="text-[14px] text-brandWeek font-bold">공지사항</span>
              </div>
              <span className="text-[14px] text-foreground-600">
                주문택배 마감시간은 14시 이전입니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
