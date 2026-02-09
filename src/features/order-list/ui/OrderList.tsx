'use client';

import { Divider } from '@heroui/react';
import { Info } from 'lucide-react';

import { ExcelExportButton } from '@/shared';

const OrderList = () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">주문목록</span>
        {/* <OrderListExportButton data={data as OrderListType[]} /> */}
        <ExcelExportButton
          onClick={() => {
            console.log('엑셀 다운로드');
          }}
        />
      </div>
      <div className="flex w-full flex-col gap-4">
        <OrderContainer />
        <OrderContainer />
        <OrderContainer />
        <OrderContainer />
      </div>
    </div>
  );
};

const OrderContainer = () => {
  return (
    <div className="border-foreground-200 flex w-full flex-col gap-6 rounded-md border p-6">
      {/* 주문 overview */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">주문일시</span>
          <span className="text-foreground-700 text-sm font-bold">2026-02-09 12:00:00</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">총 결제금액</span>
          <span className="text-foreground-700 text-sm font-bold">120,00원</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">결제 방법</span>
          <span className="text-foreground-700 text-sm font-bold">신용카드</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">주문번호</span>
          <span className="text-foreground-700 text-sm font-bold">12345678954550</span>
        </div>
      </div>
      <Divider />
      <BankTransferPendingAlert />
      {/* 구매 상품 리스트 영역 */}
      <div className="flex flex-col gap-6">
        <OrderProductItem />
        <OrderProductItem />
        <OrderProductItem />
      </div>
    </div>
  );
};

const BankTransferPendingAlert = () => {
  return (
    <div className="flex items-center gap-6 rounded-md border border-amber-200 bg-amber-100 p-4 text-amber-700">
      <Info className="size-8 text-amber-700" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <span className="font-medium text-amber-700">입금이 완료되지 않은 주문이 있습니다.</span>
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-sm">예금주</span>
            <span className="text-sm font-bold">유안메디팜</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">은행</span>
            <span className="text-sm font-bold">우리은행</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">계좌번호</span>
            <span className="text-sm font-bold">1005-504-652055</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderProductItem = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-bold">배송중</span>
      <div className="flex w-full items-center gap-6">
        {/* 상품이미지 */}
        <div className="flex aspect-square w-[100px] shrink-0 items-center justify-center rounded-md bg-neutral-50">
          <span className="text-xs">이미지</span>
        </div>
        {/* 상품정보 */}
        <div className="flex shrink-0 flex-col justify-center text-[15px]">
          <span className="text-lg font-bold">상품명</span>
          <div className="mt-4 flex items-center gap-10">
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">제조사</span>
              <span className="text-foreground-700 font-bold">휴온닥터스</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">배송비</span>
              <span className="text-foreground-700 font-bold">1,000원</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">구매가격</span>
              <span className="text-foreground-700 font-bold">7,000원</span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">수량</span>
              <span className="text-foreground-700 font-bold">2개</span>
            </div>
          </div>
        </div>
        {/* 주문 액션 */}
        <div className="flex w-full items-center justify-end">
          <button className="cursor-pointer rounded-sm bg-red-100 px-4 py-2 text-sm text-red-500">
            주문취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
