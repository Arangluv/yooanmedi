'use client'

import Navbar from '@order/(page)/_components/Navbar'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Button, DateRangePicker, Divider, Input } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'

export default function OrderListPage() {
  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <ContentWrapper>
        <ListTitle />
        <ListFilterSection />
        <ListTableSection />
      </ContentWrapper>
    </div>
  )
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-5xl flex flex-col">{children}</div>
    </div>
  )
}

function ListTitle() {
  return (
    <div className="w-full flex justify-between items-center my-4 pb-4 border-b-2 border-foreground-200">
      <div className="">
        <span className="text-3xl font-bold">주문 내역</span>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/order" className="text-foreground-600">
          상품조회
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand font-bold">주문내역</span>
      </div>
    </div>
  )
}

function ListFilterSection() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center my-4">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ListFilterItem value="일주일" />
          <ListFilterItem value="한달" />
          <ListFilterItem value="3개월" />
          <ListFilterItem value="6개월" />
          <ListFilterItem value="1년" />
        </div>
        <button
          className="flex gap-1 items-center text-foreground-600 cursor-pointer"
          onClick={handleOpen}
        >
          상세조회 <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-4 w-full mt-4">
          <Divider />
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 w-full items-center">
              <I18nProvider locale="ko">
                <div className="w-1/2">
                  <DateRangePicker label="기간" size="sm" />
                </div>
              </I18nProvider>
              <div className="w-1/2">
                <Input radius="sm" label="상품명" size="sm" />
              </div>
              <Button className="bg-brand text-white" radius="sm">
                조회하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ListFilterItem({ value }: { value: string }) {
  return (
    <div className="px-6 py-1 rounded-full bg-brand text-white">
      <span className="text-white text-sm">{value}</span>
    </div>
  )
}

function ListTableSection() {
  return (
    <div className="flex flex-col w-full gap-4 mt-8">
      <span className="text-xl font-bold">주문내역</span>
      <table>
        <thead>
          <tr className="bg-neutral-100 font-normal text-foreground-700 text-sm">
            <th className="py-2">번호</th>
            <th>주문일시</th>
            <th>제조사</th>
            <th>상품명</th>
            <th>가격</th>
            <th>주문수량</th>
            <th>총 금액</th>
            <th>주문상태</th>
            <th>택배사</th>
            <th>주문취소</th>
          </tr>
        </thead>
        <tbody>
          {/* <ListBody /> */}
          <ListEmptyBody />
        </tbody>
      </table>
    </div>
  )
}

function ListBody() {
  return (
    <tr>
      <td>1</td>
      <td>2025-01-01</td>
      <td>1234567890</td>
    </tr>
  )
}

function ListEmptyBody() {
  return (
    <tr>
      <td
        colSpan={10}
        className="text-center py-[200px] border-1 border-t-none border-foreground-200 text-foreground-600"
      >
        주문내역이 없습니다.
      </td>
    </tr>
  )
}
