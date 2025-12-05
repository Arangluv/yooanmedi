'use client'

import {
  Badge,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Button,
} from '@heroui/react'
import { ShoppingCart, Trash } from 'lucide-react'

export default function Inventory() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const temp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  return (
    <>
      <div className="fixed bottom-6 right-8">
        <Badge content={10} color="danger" placement="top-right" size="lg">
          <button
            className="min-w-20 h-20 bg-brand rounded-md flex items-center gap-2 px-4 justify-center hover:bg-brandWeek transition-colors duration-300 cursor-pointer"
            onClick={onOpen}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="text-white font-bold">장바구니</span>
          </button>
        </Badge>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" radius="sm">
        <ModalContent>
          <ModalHeader>
            <span className="text-lg font-bold">장바구니(주문내역)</span>
          </ModalHeader>
          <ModalBody>
            <table>
              <thead>
                <tr className="text-[15px] text-foreground-700 bg-neutral-100">
                  <th className="text-start border-1 border-foreground-200 pl-2 py-2">날짜</th>
                  <th className="text-start border-1 border-foreground-200 pl-2 py-2">상품이름</th>
                  <th className="text-start border-1 border-foreground-200 pl-2 py-2">보험코드</th>
                  <th className="text-start border-1 border-foreground-200 pl-2">수량</th>
                  <th className="text-start border-1 border-foreground-200 pl-2">단가</th>
                  <th className="text-start border-1 border-foreground-200 pl-2">금액</th>
                  <th className="text-center border-1 border-foreground-200 pl-2">삭제하기</th>
                </tr>
              </thead>
              <tbody>
                {temp.map((item) => (
                  <tr className="text-[15px] text-foreground-700 border-1 border-foreground-200">
                    <td className="text-start pl-2 border-r-1 border-foreground-200 py-2">
                      2025-12-05
                    </td>
                    <td className="text-start pl-2 border-r-1 border-foreground-200 py-2">
                      테타불린에스앤주PFS
                    </td>
                    <td className="pl-2 border-r-1 border-foreground-200">654400681</td>
                    <td className="pl-2 border-r-1 border-foreground-200">10</td>
                    <td className="pl-2 border-r-1 border-foreground-200">106,000원</td>
                    <td className="pl-2 border-r-1 border-foreground-200">1,060,000원</td>
                    <td className="pl-2">
                      <Trash className="w-5 h-5 text-danger cursor-pointer mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter className="flex flex-col">
            <div className="w-full h-[1px] bg-foreground-200"></div>
            <div className="flex flex-col gap-6 mt-3 bg-neutral-50 p-4">
              <span className="text-lg font-bold">주문 예상금액</span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>총 상품금액</span>
                  <span>1,060,000원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>12,000원</span>
                </div>
                <div className="w-full h-[1px] bg-foreground-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="font-bold">예상 결제금액</span>
                  <span className="font-bold text-brandWeek">1,072,000원</span>
                </div>
              </div>
            </div>
            <Button className="bg-brand text-white !h-[56px]" size="lg" radius="sm">
              총 12개의 상품 구매하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
