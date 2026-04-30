'use client';

import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button as HeroUIButton,
  ModalFooter,
  NumberInput,
} from '@heroui/react';
import { Button } from '@/shared';
import { formatNumberWithCommas, useSiteMetaStore } from '@/shared';
import { getDeliveryFeeFromCartItem, usePrice } from '@/entities/price';
import useCartModalStore from '../model/hooks/useCartModalStore';
import { useCartQuery } from '../model/hooks/useCartQuery';
import { type CartItem } from '../model/cart.schema';
import DiscountAlertBox from './DiscountAlertBox';
import { Minus, Plus, Trash } from 'lucide-react';
import { useCart } from '../model/hooks/useCart';

const CartModal = () => {
  const { isOpen, onOpenChange } = useCartModalStore();
  const {
    result: { data },
  } = useCartQuery();
  const { updateCart } = useCart();

  const [isModified, setIsModified] = useState(false);
  const [quantityInfo, setQuantityInfo] = useState(() => {
    const map = new Map();
    data.items.forEach((item) => {
      map.set(item.id, item.quantity);
    });

    return map;
  });

  const onSaveClick = () => {
    const cartItems = [...data.items];
    cartItems.forEach((item) => {
      item.quantity = quantityInfo.get(item.id);
    });

    try {
      updateCart(cartItems);
      setIsModified(false);
    } catch (error) {
      console.log('변경 사항을 저장하는데 문제가 발생했습니다');
    }
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
              {data.items.map((item) => {
                const { product } = item;
                return (
                  <tr
                    className="text-foreground-700 border-foreground-200 border-1 text-[14px]"
                    key={product.id}
                  >
                    <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                      {new Date().toISOString().slice(0, 10)}
                    </td>
                    <td className="border-foreground-200 border-r-1 text-center">
                      {product.insurance_code ? product.insurance_code : '-'}
                    </td>
                    <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                      {product.name}
                    </td>
                    <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                      {product.manufacturer}
                    </td>
                    <td className="border-foreground-200 border-r-1 text-center">
                      {product.specification}
                    </td>
                    <td className="border-foreground-200 border-r-1 pr-2 text-end">
                      {formatNumberWithCommas(product.price)}원
                    </td>
                    <td className="border-foreground-200 border-r-1 text-end">
                      <CartItemQuantityEditCell
                        item={item}
                        setQuantityInfo={setQuantityInfo}
                        setIsModified={setIsModified}
                      />
                    </td>
                    <td className="border-foreground-200 border-r-1 pr-2 text-end">
                      {formatNumberWithCommas(product.delivery_fee)}원
                    </td>
                    <td className="border-foreground-200 border-r-1 pr-2 text-end">
                      {getDeliveryFeeFromCartItem(item)}원
                    </td>
                    <td>
                      <CartItemDeleteCell item={item} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isModified && (
            <Button
              onClick={() => {
                onSaveClick();
              }}
            >
              변경사항 저장하기
            </Button>
          )}
        </ModalBody>
        <CartSummary items={data.items} isModified={isModified} />
      </ModalContent>
    </Modal>
  );
};

const CartItemDeleteCell = ({ item }: { item: CartItem }) => {
  const { deleteCartItem } = useCart();
  return (
    <div className="mx-auto flex w-fit justify-center">
      <button className="cursor-pointer" onClick={() => deleteCartItem(item.id)}>
        <Trash className="text-danger-400 h-4 w-4 cursor-pointer" />
      </button>
    </div>
  );
};

const CartItemQuantityEditCell = ({
  item,
  setIsModified,
  setQuantityInfo,
}: {
  item: CartItem;
  setIsModified: Dispatch<SetStateAction<boolean>>;
  setQuantityInfo: Dispatch<SetStateAction<Map<any, any>>>;
}) => {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <div className="mx-auto flex w-fit items-center gap-1">
      <HeroUIButton
        isIconOnly
        size="sm"
        variant="light"
        className="border-foreground-200 border-1 bg-neutral-50"
        onPress={() => {
          const newQuantity = quantity - 1 < 1 ? 1 : quantity - 1;
          setIsModified(true);
          setQuantityInfo((prev) => {
            const newMap = new Map(prev);
            newMap.set(item.id, newQuantity);
            return newMap;
          });
          setQuantity(newQuantity);
        }}
      >
        <Minus className="h-3 w-3" strokeWidth={1.5} />
      </HeroUIButton>
      <NumberInput
        aria-label="수량"
        size="sm"
        hideStepper
        radius="sm"
        variant="bordered"
        minValue={1}
        maxValue={999}
        defaultValue={item.quantity}
        value={quantity}
        onValueChange={(value) => {
          setIsModified(true);
          setQuantityInfo((prev) => {
            const newMap = new Map(prev);
            newMap.set(item.id, value);
            return newMap;
          });
          setQuantity(value);
        }}
        classNames={{ base: 'w-fit', inputWrapper: 'h-5 w-12 border-1 shadow-none' }}
      />
      <HeroUIButton
        isIconOnly
        size="sm"
        variant="light"
        className="border-foreground-200 border-1 bg-neutral-50"
        onPress={() => {
          const newQuantity = quantity + 1 > 999 ? 999 : quantity + 1;
          setIsModified(true);
          setQuantityInfo((prev) => {
            const newMap = new Map(prev);
            newMap.set(item.id, newQuantity);
            return newMap;
          });
          setQuantity(newQuantity);
        }}
      >
        <Plus className="h-3 w-3" strokeWidth={1.5} />
      </HeroUIButton>
    </div>
  );
};

const CartSummary = ({ items, isModified }: { items: CartItem[]; isModified: boolean }) => {
  const router = useRouter();
  const { minOrderPrice } = useSiteMetaStore();
  const { onOpenChange } = useCartModalStore();
  const { originalPrice, originalDeliveryFee, discountedPrice, payablePrice } = usePrice({
    cartItems: [...items], // 그냥 item 전달시 참조주소는 바뀌지 않기때문에 해당 부분 렌더링이 안됨 -> 리팩토링시 개선
    minOrderPrice,
  });

  return (
    <ModalFooter className="flex flex-col">
      <div className="flex flex-col">
        <div className="bg-foreground-200 h-[1px] w-full"></div>
        <DiscountAlertBox minOrderPrice={minOrderPrice} />
        <div className="my-4 flex flex-col gap-6 bg-neutral-50 p-4">
          <span className="text-lg font-bold">주문 예상금액</span>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span>총 상품금액</span>
              <span>{formatNumberWithCommas(originalPrice)}원</span>
            </div>
            <div className="flex justify-between">
              <span>총 배송비</span>
              <span>{formatNumberWithCommas(originalDeliveryFee)}원</span>
            </div>
            {/* 할인된 배송비 */}
            <div className="flex justify-between">
              <span className="text-brand">할인된 배송비</span>
              <span className="text-brand">-{formatNumberWithCommas(discountedPrice)}원</span>
            </div>
            <div className="bg-foreground-200 my-2 h-[1px] w-full"></div>
            <div className="flex justify-between">
              <span className="font-bold">총 결제금액</span>
              <span className="text-brandWeek font-bold">
                {formatNumberWithCommas(payablePrice)}원
              </span>
            </div>
          </div>
        </div>
        <HeroUIButton
          className="bg-brand !h-[56px] text-white"
          size="lg"
          radius="sm"
          isDisabled={items.length === 0 || isModified}
          onPress={() => {
            router.push('/order/payments');
            onOpenChange(false);
          }}
        >
          총 {items?.length ?? 0}개의 상품 구매하기
        </HeroUIButton>
      </div>
    </ModalFooter>
  );
};

export default CartModal;
