'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  NumberInput,
} from '@heroui/react'
import { InventoryContext, InventoryModalContext } from '@order/_context/order_context'
import { useContext, useEffect, useState } from 'react'
import { Trash, SquarePen } from 'lucide-react'
import { formatNumberWithCommas } from '@order/utils'
import { ProductItemType } from '@order/_type'
import { Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { QuantityChangedToast } from '../ToastComponents'
import { useRouter } from 'next/navigation'
import { calculateDeliveryFee, calculateTotalDeliveryFee } from '@lib/product/utils'

export default function InventoryModal() {
  const { isOpen, onOpenChange } = useContext(InventoryModalContext)
  const { inventory, setInventory } = useContext(InventoryContext)

  const handleDelete = (id: number) => {
    const newInventory = inventory.filter((item) => item.product.id !== id)
    setInventory(newInventory)
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" radius="sm" classNames={{ base: "max-w-[1180px]" }}>
      <ModalContent>
        <ModalHeader>
          <span className="text-lg font-bold">장바구니(주문내역)</span>
        </ModalHeader>
        <ModalBody>
          <table>
            <thead>
              <tr className="text-[14px] text-foreground-700 bg-neutral-100">
                <th className="border-1 border-foreground-200 py-2">날짜</th>
                <th className="border-1 border-foreground-200">보험코드</th>
                <th className="border-1 border-foreground-200">상품명</th>
                <th className="border-1 border-foreground-200">제조사</th>
                <th className="border-1 border-foreground-200">규격</th>
                <th className="border-1 border-foreground-200">단가</th>
                <th className="border-1 border-foreground-200 min-w-[40px]">수량</th>
                <th className="border-1 border-foreground-200">배송비</th>
                <th className="border-1 border-foreground-200">총 배송비</th>
                <th className="border-1 border-foreground-200">삭제</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  className="text-[14px] text-foreground-700 border-1 border-foreground-200"
                  key={item.product.id}
                >
                  <td className="text-center pl-2 border-r-1 border-foreground-200 py-2">
                    {new Date().toISOString().slice(0, 10)}
                  </td>
                  <td className="text-center border-r-1 border-foreground-200">
                    {item.product.insurance_code ? item.product.insurance_code : '-'}
                  </td>
                  <td className="text-center pl-2 border-r-1 border-foreground-200 py-2">
                    {item.product.name}
                  </td>
                  <td className="text-center pl-2 border-r-1 border-foreground-200 py-2">
                    {item.product.manufacturer}
                  </td>
                  <td className="text-center border-r-1 border-foreground-200">
                    {item.product.specification}
                  </td>
                  <td className="pr-2 border-r-1 border-foreground-200 text-end">
                    {formatNumberWithCommas(item.product.price)}원
                  </td>
                  <QuantityTableData
                    inventory={inventory}
                    quantity={item.quantity}
                    setInventory={setInventory}
                    productId={item.product.id}
                  />
                  <td className="text-end border-r-1 border-foreground-200 pr-2">{formatNumberWithCommas(item.product.delivery_fee)}원</td>
                  <td className="text-end border-r-1 border-foreground-200 pr-2">{calculateDeliveryFee({ product: { ...item.product, quantity: item.quantity } })}원</td>
                  <td>
                    <div className="mx-auto w-fit flex justify-center">
                      <button
                        className="cursor-pointer"
                        onClick={() => handleDelete(item.product.id)}
                      >
                        <Trash className="w-4 h-4 text-danger-400 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter className="flex flex-col">
          <ExpectedPriceSection inventory={inventory} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function QuantityTableData({
  inventory,
  quantity,
  setInventory,
  productId,
}: {
  inventory: Array<{ product: ProductItemType; quantity: number }>
  quantity: number | null
  setInventory: (inventory: Array<{ product: ProductItemType; quantity: number }>) => void
  productId: number
}) {
  const [value, setValue] = useState(quantity ?? 0)

  useEffect(() => {
    const findIndexToInventory = inventory.findIndex((item) => item.product.id === productId)
    const newInventory = [...inventory]
    newInventory[findIndexToInventory].quantity = value

    setInventory(newInventory)
  }, [value])

  return (
    <td className="text-center border-r-1 border-foreground-200">
      <div className="flex items-center gap-1 w-fit mx-auto">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="border-1 bg-neutral-50 border-foreground-200"
          onPress={() => setValue(value - 1 < 1 ? 1 : value - 1)}
        >
          <Minus className="w-3 h-3" strokeWidth={1.5} />
        </Button>
        <NumberInput
          aria-label="수량"
          size="sm"
          hideStepper
          radius="sm"
          variant="bordered"
          minValue={1}
          maxValue={999}
          value={value}
          onChange={(e) => {
            // @ts-ignore
            setValue(Number(e.target.value));
          }}
          classNames={{ base: 'w-fit', inputWrapper: 'h-5 w-12 border-1 shadow-none' }}
        />
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="border-1 bg-neutral-50 border-foreground-200"
          onPress={() => setValue(value + 1 > 999 ? 999 : value + 1)}
        >
          <Plus className="w-3 h-3" strokeWidth={1.5} />
        </Button>
      </div>
    </td>
  )
}

function ExpectedPriceSection({
  inventory,
}: {
  inventory: Array<{ product: ProductItemType; quantity: number }>
}) {
  const router = useRouter()

  // 총 상품금액
  const totalPrice = inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  // 총 배송비
  const totalDeliveryFee = calculateTotalDeliveryFee({ inventory })
  // 예상 결제금액
  const totalExpectedPrice = totalPrice + totalDeliveryFee

  return (
    <div className="flex flex-col">
      <div className="w-full h-[1px] bg-foreground-200"></div>
      <div className="flex flex-col gap-6 bg-neutral-50 p-4 my-4">
        <span className="text-lg font-bold">주문 예상금액</span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span>총 상품금액</span>
            <span>{formatNumberWithCommas(totalPrice)}원</span>
          </div>
          <div className="flex justify-between">
            <span>총 배송비</span>
            <span>{formatNumberWithCommas(totalDeliveryFee)}원</span>
          </div>
          <div className="w-full h-[1px] bg-foreground-200 my-2"></div>
          <div className="flex justify-between">
            <span className="font-bold">예상 결제금액</span>
            <span className="font-bold text-brandWeek">
              {formatNumberWithCommas(totalExpectedPrice)}원
            </span>
          </div>
        </div>
      </div>
      <Button
        className="bg-brand text-white !h-[56px]"
        size="lg"
        radius="sm"
        isDisabled={inventory.length === 0}
        onPress={() => router.push('/order/payments')}
      >
        총 {inventory?.length ?? 0}개의 상품 구매하기
      </Button>
    </div>
  )
}
