'use client';

import { Button, Divider, NumberInput } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { formatNumberWithCommas } from '@order/utils';
import { registerOrder } from '@order/(page)/payments/actions';
import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import {
  InventoryContext,
  MinOrderPriceContext,
  OrderUserInfoContext,
} from '@order/_context/order_context';
import Link from 'next/link';
import { InventoryType, OrderContextUserType, PaymentRegisterDto } from '@order/_type';
import { useRouter } from 'next/navigation';
import PaymentsBankTransferButton from './PaymentsBankTransferButton';
import { calculateDeliveryFeeNumber, calculateTotalDeliveryFee } from '@lib/product/utils';

export default function PaymentsActionSection({ userRequest }: { userRequest: string }) {
  const router = useRouter();
  const { inventory } = useContext(InventoryContext);
  const { user } = useContext(OrderUserInfoContext);
  const { minOrderPrice } = useContext(MinOrderPriceContext);
  const [usePoint, setUsePoint] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);

  const totalPrice = inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalDeliveryFee = calculateTotalDeliveryFee({ inventory });
  const discountedDeliveryFee = inventory.reduce((acc, item) => {
    if (item.product.is_free_delivery && totalPrice >= minOrderPrice) {
      return (
        acc + calculateDeliveryFeeNumber({ product: { ...item.product, quantity: item.quantity } })
      );
    }
    return acc;
  }, 0);
  const totalExpectedPrice = totalPrice + totalDeliveryFee - discountedDeliveryFee;

  useEffect(() => {
    setTotalPaymentAmount(totalExpectedPrice - usePoint);
  }, [usePoint, totalExpectedPrice]);

  useEffect(() => {
    const popupHandler = (event: MessageEvent) => {
      if (event.data.status === 'success') {
        const amount = event.data.amount;
        const approvalDate = event.data.approvalDate;
        const shopOrderNo = event.data.shopOrderNo;

        router.push(
          '/order/payments/finish?status=success&amount=' +
            amount +
            '&approvalDate=' +
            approvalDate +
            '&shopOrderNo=' +
            shopOrderNo,
        );
        router.refresh();
      } else if (event.data.status === 'error') {
        router.push('/order/payments/finish?status=error&message=' + event.data.message);
        router.refresh();
      } else {
        alert('결제 주문 등록 실패');
      }
    };

    window.addEventListener('message', popupHandler);
    return () => {
      window.removeEventListener('message', popupHandler);
    };
  }, []);

  // mallId는 서버에서만 필요하므로 클라이언트사이드에서는 생략된 타입으로 작성
  const dto: Omit<PaymentRegisterDto, 'mallId' | 'paymentsMethod'> = {
    payMethodTypeCode: '11',
    currency: '00',
    amount: Number(totalPaymentAmount),
    clientTypeCode: '00',
    returnUrl: process.env.NEXT_PUBLIC_SITE_URL + '/api/payments',
    deviceTypeCode: 'pc',
    shopOrderNo: String(generateShopOrderNo()),
    orderInfo: {
      goodsName: generateGoodsName(inventory),
      customerInfo: generateUserInfo(user as OrderContextUserType),
    },
    shopValueInfo: {
      value1: userRequest,
      value2: generateOrderList(inventory) as string,
      value3: usePoint.toString(),
      value4: user?.id?.toString() ?? '',
      value5: 'creditCard' as const,
      value6: minOrderPrice,
    },
  };

  const openPaymentPopup = (authPageUrl: string) => {
    if (!authPageUrl) {
      alert('결제 주문 등록 실패');
      return;
    }

    const width = 600;
    const height = 680;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authPageUrl,
      'payment',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }
  };
  const { mutate: registerOrderMutation } = useMutation({
    mutationFn: () => registerOrder(dto),
    onSuccess: (data) => {
      if (data?.resCd === '0000') {
        openPaymentPopup(data.authPageUrl as string);
      } else {
        alert('결제창을 불러오는데 실패했습니다. 다시 시도해주세요');
      }
    },
    onError: (error) => {
      alert('결제창을 불러오는데 실패했습니다. 다시시도해주세요');
    },
  });

  const handlePointBtnClick = () => {
    const usedPoint = calculateMaxUsePoint(user?.point ?? 0, totalExpectedPrice);
    setUsePoint(usedPoint);
  };

  const bankTransferDto = {
    amount: Number(totalPaymentAmount),
    shopOrderNo: String(generateShopOrderNo()),
    orderInfo: {
      goodsName: generateGoodsName(inventory),
      customerInfo: generateUserInfo(user as OrderContextUserType),
    },
    shopValueInfo: {
      value1: userRequest,
      value2: generateOrderList(inventory) as string,
      value3: usePoint.toString(),
      value4: user?.id?.toString() ?? '',
      value5: 'bankTransfer' as const,
      value6: minOrderPrice,
    },
  };

  if (!user) {
    return null;
  }

  return (
    <div className="border-foreground-200 flex w-full flex-col gap-6 rounded-md border-1 p-4">
      <div className="flex flex-col gap-4">
        <span className="text-xl font-bold">최종 결제 금액</span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-foreground-600">총 금액</span>
            <span className="font-bold">{formatNumberWithCommas(totalPrice)}원</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-600">배송비</span>
            <span className="font-bold">{formatNumberWithCommas(totalDeliveryFee)}원</span>
          </div>
          <DeliveryDiscountSection
            inventory={inventory}
            minOrderPrice={minOrderPrice}
            totalPrice={totalPrice}
          />
          <TotalGetPoint inventory={inventory} />
          <div className="flex justify-between gap-4">
            <span className="text-foreground-600 flex-shrink-0">적립금 사용</span>
            <div className="flex gap-2">
              <div className="flex flex-col items-start">
                <NumberInput
                  size="sm"
                  radius="sm"
                  aria-label="적립금 사용"
                  variant="bordered"
                  isDisabled={user.point === 0 || user.point === null || inventory.length === 0}
                  hideStepper
                  value={usePoint}
                  minValue={0}
                  maxValue={calculateMaxUsePoint(user.point ?? 0, totalExpectedPrice)}
                  onValueChange={(value) => {
                    setUsePoint(value);
                  }}
                  description={
                    <span className="text-brand text-[14px]">
                      (사용가능 적립금 {formatNumberWithCommas(user.point ?? 0)}원)
                    </span>
                  }
                  classNames={{
                    inputWrapper: 'border-1 border-foreground-200 shadow-none h-8',
                    description: 'flex justify-end',
                  }}
                />
              </div>
              <Button className="bg-brand h-8 text-white" radius="sm" onPress={handlePointBtnClick}>
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
            {formatNumberWithCommas(totalPaymentAmount)}원
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
          <PaymentsBankTransferButton
            bankTransferDto={bankTransferDto}
            isDisabled={isButtonDisabled({ totalPaymentAmount, totalExpectedPrice })}
          />
          <Button
            size="lg"
            radius="sm"
            isDisabled={isButtonDisabled({ totalPaymentAmount, totalExpectedPrice })}
            className="bg-brand w-full text-white"
            onPress={() => registerOrderMutation()}
          >
            카드결제
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeliveryDiscountSection({
  inventory,
  minOrderPrice,
  totalPrice,
}: {
  inventory: InventoryType['inventory'];
  minOrderPrice: number;
  totalPrice: number;
}) {
  if (totalPrice < minOrderPrice) {
    return null;
  }

  const discountedDeliveryFee = inventory.reduce((acc, item) => {
    if (item.product.is_free_delivery && totalPrice >= minOrderPrice) {
      return (
        acc + calculateDeliveryFeeNumber({ product: { ...item.product, quantity: item.quantity } })
      );
    }
    return acc;
  }, 0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground-600">할인된 배송비</span>
      <span className="text-brand font-bold">
        - {formatNumberWithCommas(discountedDeliveryFee)}원
      </span>
    </div>
  );
}

function TotalGetPoint({ inventory }: { inventory: InventoryType['inventory'] }) {
  // CASE1 - 카드 결제 시
  const totalGetPointUseCard = inventory.reduce((acc, item) => {
    return (
      acc + Math.floor((item.product.cashback_rate * item.product.price * item.quantity) / 100)
    );
  }, 0);
  // CASE2 - 무통장 입금 시
  const totalGetPointUseBank = inventory.reduce((acc, item) => {
    return (
      acc +
      Math.floor((item.product.cashback_rate_for_bank * item.product.price * item.quantity) / 100)
    );
  }, 0);

  return (
    <div className="my-1 flex items-start justify-between">
      <span className="text-foreground-600">총 적립금액</span>
      <div className="gap2 flex flex-col">
        <div className="flex items-center justify-end gap-1">
          <span className="text-foreground-600 text-[15px]">카드결제 시 </span>
          <span className="text-brand font-bold">
            {formatNumberWithCommas(totalGetPointUseCard)}원
          </span>
        </div>
        <div className="flex items-center justify-end gap-1">
          <span className="text-foreground-600 text-[15px]">무통장 입금 시 </span>
          <span className="text-brand font-bold">
            {formatNumberWithCommas(totalGetPointUseBank)}원
          </span>
        </div>
      </div>
    </div>
  );
}

function calculateMaxUsePoint(point: number, totalPrice: number) {
  if (point > totalPrice) {
    return totalPrice;
  } else {
    return point;
  }
}

function isButtonDisabled({
  totalPaymentAmount,
  totalExpectedPrice,
}: {
  totalPaymentAmount: number;
  totalExpectedPrice: number;
}) {
  // 최종 결제 금액이 0원이며, 예상 결제금액이 0원 이하인 경우 (장바구니에 물건이 없는 경우)
  if (totalPaymentAmount <= 0 && totalExpectedPrice <= 0) {
    return true;
  }

  return false;
}

function generateUserInfo(user: OrderContextUserType) {
  if (!user) {
    return {
      customerId: '',
      customerName: '',
      customerMail: '',
      customerContactNo: '',
      customerAddr: '',
    };
  }

  return {
    customerId: user.username ? user.username : '',
    customerName: user.hospitalName ? user.hospitalName : '관리자',
    customerMail: user.email ? user.email : '',
    customerContactNo: user.phoneNumber ? user.phoneNumber : '',
    customerAddr: user.address ? user.address : '',
  };
}

function generateShopOrderNo() {
  const now = new Date();
  const yyyymmdd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(1000000 + Math.random() * 9000000); // 7자리 랜덤 숫자
  return yyyymmdd + randomNum.toString();
}

function generateGoodsName(inventory: InventoryType['inventory']) {
  if (!inventory || inventory.length === 0) {
    return '';
  }

  if (inventory.length === 1) {
    return inventory[0].product.name;
  }

  return inventory[0].product.name + ' 외 ' + (inventory.length - 1) + '개의 상품';
}

function generateOrderList(inventory: InventoryType['inventory']) {
  if (!inventory || inventory.length === 0) {
    return [];
  }

  const orderList = JSON.stringify(
    inventory.map((item) => ({
      product: {
        id: item.product.id,
        price: item.product.price,
      },
      quantity: item.quantity,
    })),
  );

  return orderList ? orderList : '';
}
