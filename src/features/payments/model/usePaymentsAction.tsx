'use client';

import { useMutation } from '@tanstack/react-query';

import type { InventoryItem } from '@/entities/inventory';
import type { User } from '@/entities/user';
import { PAYMENTS_METHOD } from '@/entities/order';

import { paymentsRegisterApplicationDtoSchema } from './payments-register-schema';
import { paymentRegistration } from '../api/payment-registration';
import { openPaymentsPopup } from '../lib/open-payments-popup';
import { generateShopOrderNo } from '../lib/order-uuid';

interface UsePaymentsActionProps {
  inventory: InventoryItem[];
  user: User;
  amount: number;
  usedPoint: number;
  userRequest: string;
  minOrderPrice: number;
}

const usePaymentsAction = ({
  inventory,
  user,
  amount,
  minOrderPrice,
  usedPoint,
  userRequest,
}: UsePaymentsActionProps) => {
  const dto = {
    amount,
    clientTypeCode: '00',
    payMethodTypeCode: '11',
    currency: '00',
    deviceTypeCode: 'pc',
    returnUrl: process.env.NEXT_PUBLIC_SITE_URL + '/api/payments',
    shopOrderNo: generateShopOrderNo(),
    orderInfo: {
      goodsName: getGoodsName(inventory),
      customerInfo: {
        customerId: user.username,
        customerName: user.hospitalName,
        customerMail: user.email,
        customerContactNo: user.phoneNumber,
        customerAddr: user.address,
      },
    },
    shopValueInfo: {
      deliveryRequest: userRequest,
      orderList: inventory.map((item) => ({
        product: { id: item.product.id, price: item.product.price },
        quantity: item.quantity,
      })),
      usedPoint: usedPoint,
      userId: user.id,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
      minOrderPrice,
    },
  };

  const { mutate } = useMutation({
    mutationFn: () => paymentRegistration(paymentsRegisterApplicationDtoSchema.parse(dto)),
    onSuccess: (data) => {
      if (data.success) {
        openPaymentsPopup(data.authPageUrl);
      } else {
        alert('결제창을 불러오는데 실패했습니다. 다시 시도해주세요');
      }
    },
    onError: (error) => {
      // TODO: ZOD 에러 처리
      alert('결제창을 불러오는데 실패했습니다. 다시 시도해주세요');
    },
  });

  return { mutate };
};

const getGoodsName = (inventory: InventoryItem[]) => {
  if (inventory.length === 0) {
    return '';
  }

  if (inventory.length === 1) {
    return inventory[0].product.name;
  }

  return inventory[0].product.name + ' 외 ' + (inventory.length - 1) + '개의 상품';
};

export default usePaymentsAction;
