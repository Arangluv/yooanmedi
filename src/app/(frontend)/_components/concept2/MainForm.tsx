'use client'

import { LogoContext } from '@/context/design_contexts'
import Image from 'next/image'
import { useContext } from 'react'
import { Form, Input } from '@heroui/react'
import { Globe, Phone, Lock, User } from 'lucide-react'

export default function MainForm() {
  const { logoImage } = useContext(LogoContext)

  return (
    <div className="w-full flex flex-col">
      {/* 로고 */}
      <div className="w-full flex justify-center mb-8">
        <div className="w-[210px] h-[60px]">
          <Image src={logoImage} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>
      <Form validationBehavior="native" className="flex flex-col gap-4">
        <Input
          name="id"
          label="아이디"
          size="md"
          placeholder="아이디를 입력해주세요."
          variant="bordered"
          radius="sm"
          startContent={<User className="text-foreground-500 w-5 h-5" strokeWidth={1.5} />}
          classNames={{
            label: 'font-medium',
          }}
        />
        <Input
          name="password"
          label="비밀번호"
          size="md"
          placeholder="비밀번호를 입력해주세요."
          variant="bordered"
          radius="sm"
          startContent={<Lock className="text-foreground-500 w-5 h-5" strokeWidth={1.5} />}
          classNames={{
            label: 'font-medium',
          }}
        />
        <div className="flex flex-col gap-2 w-full">
          <button
            type="submit"
            className="w-full h-10 rounded-sm bg-brand text-white font-medium cursor-pointer hover:bg-brandWeek transition-all duration-300"
          >
            로그인
          </button>
          <button
            type="submit"
            className="w-full h-10 rounded-sm border-1 text-brandWeek font-medium cursor-pointer"
          >
            회원가입
          </button>
        </div>
        <div className="h-[1px] bg-foreground-100 w-full" />
        <div className="w-full flex justify-end">
          <span className="text-sm text-foreground-500 cursor-pointer hover:text-brandWeek transition-all duration-300">
            비밀번호 찾기
          </span>
        </div>
      </Form>
      {/* 하단 컨텐츠 */}
      <div className="flex flex-col gap-8 mt-12">
        {/* service */}
        <div className="w-full flex gap-8 items-stretch justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-brand text-lg leading-none">상담안내</span>
            <div className="w-full flex justify-end text-[13px] text-foreground-500">service</div>
          </div>
          <div className="w-[1px] h-auto bg-foreground-100"></div>
          <div className="flex flex-col gap-2">
            <span className="text-[15px] text-foreground-600 leading-none">평일 09:00 - 18:00</span>
            <span className="text-[15px] text-foreground-600 leading-none">
              점심시간 12:00 - 13:00
            </span>
            <span className="text-[13px] text-foreground-600 leading-none">
              (주말 및 공휴일 휴무)
            </span>

            <div className="mt-4">
              <span className="font-bold text-brand text-lg leading-none">031-893-0806</span>
            </div>
          </div>
        </div>
        {/* info */}
        <div className="w-full flex flex-col gap-2 p-4 rounded-md bg-neutral-50">
          <div className="flex gap-3 flex-col">
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold">의약품 도소매 전문</span>
              <span className="text-[13px] text-foreground-600">
                주문관리를 위한 홈페이지입니다. 도메인을 확인해주세요
              </span>
            </div>
            <div className="flex gap-2">
              <div className="w-full rounded-full flex items-center gap-1">
                <Globe className="w-4 h-4 text-brandWeek" />
                <span className="text-[17px] text-brandWeek font-medium">www.yooanmedi.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
