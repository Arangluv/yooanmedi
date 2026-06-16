'use client';

import { useMutation } from '@tanstack/react-query';
import { CartItem } from '@/entities/cart-item';
import { User } from '@/entities/user';
import { registerTransactionApi, EasyPayRegisterTransactionRequestDto } from '@/entities/easypay';
import { usePopup } from '../hooks';

interface UsePaymentsActionProps {
  cartItems: CartItem[];
  user: User;
  amount: number;
  usedPoint: number;
  userRequest: string;
  minOrderPrice: number;
}

export const usePaymentsAction = ({
  cartItems,
  user,
  amount,
  minOrderPrice,
  usedPoint,
  userRequest,
}: UsePaymentsActionProps) => {
  const { popupOpen } = usePopup();

  const dto = {
    amount: amount - usedPoint,
    orderInfo: {
      goodsName: getGoodsName(cartItems),
      customerInfo: {
        customerId: user.username,
        customerName: user.hospitalName,
        customerMail: user.contactEmail,
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
  } as EasyPayRegisterTransactionRequestDto;

  const { mutate } = useMutation({
    mutationFn: () => registerTransactionApi(dto),
    onSuccess: (result) => {
      if (result.isSuccess) {
        popupOpen(result.data.authPageUrl);
      } else {
        alert('결제창을 불러오는데 실패했습니다. 다시 시도해주세요');
      }
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
