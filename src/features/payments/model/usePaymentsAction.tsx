'use client';

import { useMutation } from '@tanstack/react-query';
import type { CartItem } from '@/entities/cart';
import type { User } from '@/entities/user';
import { RegisterTransactionRequestDto } from '@/entities/easypay/model/schemas/easypay.register-transaction.schema';
import { openPaymentsPopup } from '../lib/open-payments-popup';
import { registerTransaction } from '@/entities/easypay/api/easypay.api';

interface UsePaymentsActionProps {
  cartItems: CartItem[];
  user: User;
  amount: number;
  usedPoint: number;
  userRequest: string;
  minOrderPrice: number;
}

const usePaymentsAction = ({
  cartItems,
  user,
  amount,
  minOrderPrice,
  usedPoint,
  userRequest,
}: UsePaymentsActionProps) => {
  const dto = {
    amount: amount - usedPoint,
    orderInfo: {
      goodsName: getGoodsName(cartItems),
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
      orderList: cartItems.map((item) => ({
        product: { id: item.product.id, price: item.product.price },
        quantity: item.quantity,
      })),
      usedPoint: usedPoint,
      userId: user.id,
      minOrderPrice,
    },
  } as RegisterTransactionRequestDto;

  const { mutate } = useMutation({
    mutationFn: () => registerTransaction(dto),
    onSuccess: (actionResult) => {
      if (actionResult.isSuccess) {
        openPaymentsPopup(actionResult.data.authPageUrl);
      } else {
        alert('결제창을 불러오는데 실패했습니다. 다시 시도해주세요');
      }
    },
    onError: (error) => {
      // todo :: mudation onError 처리 정리하기
      alert('결제창을 불러오는데 실패했습니다. 다시 시도해주세요');
    },
  });

  return { mutate };
};

const getGoodsName = (cartItems: CartItem[]) => {
  if (cartItems.length === 0) {
    return '';
  }

  if (cartItems.length === 1) {
    return cartItems[0].product.name;
  }

  return cartItems[0].product.name + ' 외 ' + (cartItems.length - 1) + '개의 상품';
};

export default usePaymentsAction;
