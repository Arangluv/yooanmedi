'use client';

import { useMutation } from '@tanstack/react-query';
import type { InventoryItem } from '@/entities/inventory';
import type { User } from '@/entities/user';
import { RegisterTransactionRequestDto } from '@/entities/easypay/model/schemas/easypay.register-transaction.schema';
import { openPaymentsPopup } from '../lib/open-payments-popup';
import { registerTransaction } from '@/entities/easypay/api/easypay.api';

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
    amount: amount - usedPoint,
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
