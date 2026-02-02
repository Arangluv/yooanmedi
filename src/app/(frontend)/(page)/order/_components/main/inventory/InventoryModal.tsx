'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  NumberInput,
} from '@heroui/react';
import {
  InventoryContext,
  InventoryModalContext,
  MinOrderPriceContext,
} from '@/app/(frontend)/(page)/order/_context/order_context';
import { useContext, useEffect, useState } from 'react';
import { Trash, Info } from 'lucide-react';
import { formatNumberWithCommas } from '@/app/(frontend)/(page)/order/utils';
import { ProductItemType } from '@/app/(frontend)/(page)/order/_type';
import { Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  calculateDeliveryFee,
  calculateDeliveryFeeNumber,
  calculateTotalDeliveryFee,
} from '@lib/product/utils';

export default function InventoryModal() {
  const { isOpen, onOpenChange } = useContext(InventoryModalContext);
  const { inventory, setInventory } = useContext(InventoryContext);
  const { minOrderPrice } = useContext(MinOrderPriceContext);

  const handleDelete = (id: number) => {
    const newInventory = inventory.filter((item) => item.product.id !== id);
    setInventory(newInventory);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      radius="sm"
      classNames={{ base: 'max-w-[1180px]' }}
    >
      <ModalContent>
        <ModalHeader>
          <span className="text-lg font-bold">장바구니(주문내역)</span>
        </ModalHeader>
        <ModalBody>
          <table>
            <thead>
              <tr className="text-foreground-700 bg-neutral-100 text-[14px]">
                <th className="border-foreground-200 border-1 py-2">날짜</th>
                <th className="border-foreground-200 border-1">보험코드</th>
                <th className="border-foreground-200 border-1">상품명</th>
                <th className="border-foreground-200 border-1">제조사</th>
                <th className="border-foreground-200 border-1">규격</th>
                <th className="border-foreground-200 border-1">단가</th>
                <th className="border-foreground-200 min-w-[40px] border-1">수량</th>
                <th className="border-foreground-200 border-1">배송비</th>
                <th className="border-foreground-200 border-1">총 배송비</th>
                <th className="border-foreground-200 border-1">삭제</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  className="text-foreground-700 border-foreground-200 border-1 text-[14px]"
                  key={item.product.id}
                >
                  <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                    {new Date().toISOString().slice(0, 10)}
                  </td>
                  <td className="border-foreground-200 border-r-1 text-center">
                    {item.product.insurance_code ? item.product.insurance_code : '-'}
                  </td>
                  <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                    {item.product.name}
                  </td>
                  <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                    {item.product.manufacturer}
                  </td>
                  <td className="border-foreground-200 border-r-1 text-center">
                    {item.product.specification}
                  </td>
                  <td className="border-foreground-200 border-r-1 pr-2 text-end">
                    {formatNumberWithCommas(item.product.price)}원
                  </td>
                  <QuantityTableData
                    inventory={inventory}
                    quantity={item.quantity}
                    setInventory={setInventory}
                    productId={item.product.id}
                  />
                  <td className="border-foreground-200 border-r-1 pr-2 text-end">
                    {formatNumberWithCommas(item.product.delivery_fee)}원
                  </td>
                  <td className="border-foreground-200 border-r-1 pr-2 text-end">
                    {calculateDeliveryFee({
                      product: { ...item.product, quantity: item.quantity },
                    })}
                    원
                  </td>
                  <td>
                    <div className="mx-auto flex w-fit justify-center">
                      <button
                        className="cursor-pointer"
                        onClick={() => handleDelete(item.product.id)}
                      >
                        <Trash className="text-danger-400 h-4 w-4 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter className="flex flex-col">
          <ExpectedPriceSection inventory={inventory} minOrderPrice={minOrderPrice} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function QuantityTableData({
  inventory,
  quantity,
  setInventory,
  productId,
}: {
  inventory: Array<{ product: ProductItemType; quantity: number }>;
  quantity: number | null;
  setInventory: (inventory: Array<{ product: ProductItemType; quantity: number }>) => void;
  productId: number;
}) {
  const [value, setValue] = useState(quantity ?? 0);

  useEffect(() => {
    const findIndexToInventory = inventory.findIndex((item) => item.product.id === productId);
    const newInventory = [...inventory];
    newInventory[findIndexToInventory].quantity = value;

    setInventory(newInventory);
  }, [value]);

  return (
    <td className="border-foreground-200 border-r-1 text-center">
      <div className="mx-auto flex w-fit items-center gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="border-foreground-200 border-1 bg-neutral-50"
          onPress={() => setValue(value - 1 < 1 ? 1 : value - 1)}
        >
          <Minus className="h-3 w-3" strokeWidth={1.5} />
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
          className="border-foreground-200 border-1 bg-neutral-50"
          onPress={() => setValue(value + 1 > 999 ? 999 : value + 1)}
        >
          <Plus className="h-3 w-3" strokeWidth={1.5} />
        </Button>
      </div>
    </td>
  );
}

function DiscountAlertSection({
  inventory,
  minOrderPrice,
}: {
  inventory: Array<{ product: ProductItemType; quantity: number }>;
  minOrderPrice: number;
}) {
  // 총 상품금액
  const totalPrice = inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  // 할인된 배송비
  const discountedDeliveryFee = inventory.reduce((acc, item) => {
    if (item.product.is_free_delivery && totalPrice >= minOrderPrice) {
      return (
        acc + calculateDeliveryFeeNumber({ product: { ...item.product, quantity: item.quantity } })
      );
    }
    return acc;
  }, 0);

  if (totalPrice >= minOrderPrice && discountedDeliveryFee > 0) {
    return (
      <div className="bg-brandWeek/10 mt-4 flex items-center justify-end gap-1 rounded-md p-2">
        <Info className="text-brand h-4 w-4" />
        <span className="text-brand text-sm">
          주문금액 {`${formatNumberWithCommas(minOrderPrice)}`}원 이상 고객 혜택으로 배송비 할인이
          적용되었어요
        </span>
      </div>
    );
  }

  return null;
}

function ExpectedPriceSection({
  inventory,
  minOrderPrice,
}: {
  inventory: Array<{ product: ProductItemType; quantity: number }>;
  minOrderPrice: number;
}) {
  const router = useRouter();

  // 총 상품금액
  const totalPrice = inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  // 총 배송비
  const totalDeliveryFee = calculateTotalDeliveryFee({ inventory });
  // 할인된 배송비
  const discountedDeliveryFee = inventory.reduce((acc, item) => {
    if (item.product.is_free_delivery && totalPrice >= minOrderPrice) {
      return (
        acc + calculateDeliveryFeeNumber({ product: { ...item.product, quantity: item.quantity } })
      );
    }
    return acc;
  }, 0);

  // 예상 결제금액
  const totalExpectedPrice = totalPrice + totalDeliveryFee - discountedDeliveryFee;

  return (
    <div className="flex flex-col">
      <div className="bg-foreground-200 h-[1px] w-full"></div>
      <DiscountAlertSection inventory={inventory} minOrderPrice={minOrderPrice} />
      <div className="my-4 flex flex-col gap-6 bg-neutral-50 p-4">
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
          {/* 할인된 배송비 */}
          <div className="flex justify-between">
            <span className="text-brand">할인된 배송비</span>
            <span className="text-brand">-{formatNumberWithCommas(discountedDeliveryFee)}원</span>
          </div>
          <div className="bg-foreground-200 my-2 h-[1px] w-full"></div>
          <div className="flex justify-between">
            <span className="font-bold">총 결제금액</span>
            <span className="text-brandWeek font-bold">
              {formatNumberWithCommas(totalExpectedPrice)}원
            </span>
          </div>
        </div>
      </div>
      <Button
        className="bg-brand !h-[56px] text-white"
        size="lg"
        radius="sm"
        isDisabled={inventory.length === 0}
        onPress={() => router.push('/order/payments')}
      >
        총 {inventory?.length ?? 0}개의 상품 구매하기
      </Button>
    </div>
  );
}
