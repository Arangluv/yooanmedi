'use client';

import Link from 'next/link';

import { Button, NumberInput, Divider } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { usePrice } from '@/entities/price';
import { useEarnPoint } from '@/entities/point';
import type { CartItem } from '@/entities/cart';
import { useSiteMetaStore, formatNumberWithCommas } from '@/shared';
import { useAuthStore } from '@/entities/user';
import { useUsedPoint } from '@/entities/point';
import PaymentsPopupListener from '../model/payments-popup-listener';
import usePaymentsAction from '../model/usePaymentsAction';
import BankTransferButton from './BankTransferButton';
import { useCartQuery } from '@/entities/cart';

const PaymentsAction = ({ userRequest }: { userRequest: string }) => {
  const {
    result: { data },
  } = useCartQuery();
  const { minOrderPrice } = useSiteMetaStore();
  const user = useAuthStore((state) => state.user);

  const { originalPrice, originalDeliveryFee, discountedPrice, payablePrice } = usePrice({
    cartItems: data.items,
    minOrderPrice,
  });

  const { pointStatus, updatePoint, updateFieldToMaxUseablePoint } = useUsedPoint({ user });
  const { mutate: registerOrderMutation } = usePaymentsAction({
    cartItems: data.items,
    user,
    amount: payablePrice,
    minOrderPrice,
    usedPoint: pointStatus.usedPoint,
    userRequest,
  });

  return (
    <PaymentsPopupListener>
      <div className="border-foreground-200 flex w-full flex-col gap-6 rounded-md border-1 p-4">
        <div className="flex flex-col gap-4">
          <span className="text-xl font-bold">최종 결제 금액</span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-foreground-600">총 금액</span>
              <span className="font-bold">{formatNumberWithCommas(originalPrice)}원</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-600">배송비</span>
              <span className="font-bold">{formatNumberWithCommas(originalDeliveryFee)}원</span>
            </div>
            <DeliveryDiscountInfo discountedDeliveryFee={discountedPrice} />
            <TotalGetPoint cartItems={data.items} />
            <div className="flex justify-between gap-4">
              <span className="text-foreground-600 flex-shrink-0">적립금 사용</span>
              <div className="flex gap-2">
                <div className="flex flex-col items-start">
                  <NumberInput
                    size="sm"
                    radius="sm"
                    aria-label="적립금 사용"
                    variant="bordered"
                    isDisabled={pointStatus.maxUseablePoint === 0 || data.items.length === 0}
                    hideStepper
                    value={pointStatus.usedPoint}
                    minValue={0}
                    maxValue={pointStatus.maxUseablePoint}
                    onValueChange={(value) => {
                      updatePoint({ usedPoint: value, payablePrice });
                    }}
                    description={
                      <span className="text-brand text-[14px]">
                        (사용가능 적립금 {formatNumberWithCommas(pointStatus.maxUseablePoint)}원)
                      </span>
                    }
                    classNames={{
                      inputWrapper: 'border-1 border-foreground-200 shadow-none h-8',
                      description: 'flex justify-end',
                    }}
                  />
                </div>
                <Button
                  className="bg-brand h-8 text-white"
                  radius="sm"
                  onPress={() => updateFieldToMaxUseablePoint({ payablePrice })}
                  isDisabled={pointStatus.maxUseablePoint === 0 || data.items.length === 0}
                >
                  전액사용
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">총 결제 금액</span>
            <span className="text-brand text-xl font-bold">
              {formatNumberWithCommas(payablePrice - pointStatus.usedPoint)}원
            </span>
          </div>
          <Link
            href="/terms?type=terms"
            target="_blank"
            className="text-foreground-600 hover:text-foreground-800 flex items-center justify-between text-sm transition-all duration-300"
          >
            <span> 서비스 이용약관 동의 </span>
            <span>
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
          <Divider />
          <p className="text-foreground-600 text-sm">
            위 주문 내용을 확인하였으며 회원 본인은 개인정보 이용 및 서비스 이용약관에 동의합니다.
          </p>
          <div className="flex items-center gap-2">
            <BankTransferButton
              deliveryRequest={userRequest}
              cartItems={data.items}
              usedPoint={pointStatus.usedPoint}
              userId={user.id}
              minOrderPrice={minOrderPrice}
              amount={payablePrice - pointStatus.usedPoint}
            />
            <Button
              size="lg"
              radius="sm"
              className="bg-brand w-full text-white"
              isDisabled={payablePrice === 0 || data.items.length === 0}
              onPress={() => registerOrderMutation()}
            >
              카드결제
            </Button>
          </div>
        </div>
      </div>
    </PaymentsPopupListener>
  );
};

const DeliveryDiscountInfo = ({ discountedDeliveryFee }: { discountedDeliveryFee: number }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground-600">할인된 배송비</span>
      <span className="text-brand font-bold">
        - {formatNumberWithCommas(discountedDeliveryFee)}원
      </span>
    </div>
  );
};

const TotalGetPoint = ({ cartItems }: { cartItems: CartItem[] }) => {
  const { cardPoint, bankPoint } = useEarnPoint({ cartItems });

  return (
    <div className="my-1 flex items-start justify-between">
      <span className="text-foreground-600">총 적립금액</span>
      <div className="gap2 flex flex-col">
        <div className="flex items-center justify-end gap-1">
          <span className="text-foreground-600 text-[15px]">카드결제 시 </span>
          <span className="text-brand font-bold">{formatNumberWithCommas(cardPoint)}원</span>
        </div>
        <div className="flex items-center justify-end gap-1">
          <span className="text-foreground-600 text-[15px]">무통장 입금 시 </span>
          <span className="text-brand font-bold">{formatNumberWithCommas(bankPoint)}원</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentsAction;
