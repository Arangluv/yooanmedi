import { AlertDialogConfig, BusinessLogicError } from '@/shared';
import { PAYMENTS_METHOD, PaymentsMethod } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, OrderProductStatus } from '@/entities/order-product';

export const getDialogConfig = (
  currentOrderProductStatus: OrderProductStatus,
  paymentsMethod: PaymentsMethod,
): AlertDialogConfig => {
  if (
    currentOrderProductStatus === ORDER_PRODUCT_STATUS.pending &&
    paymentsMethod === PAYMENTS_METHOD.bank_transfer
  ) {
    return {
      triggerText: '주문취소',
      headerTitle: '해당 상품주문을 취소하시겠습니까?',
      description: '선택하신 상품의 주문이 취소처리 됩니다',
      action: {
        text: '주문취소',
        onClick: () => {},
      },
    };
  }

  if (
    currentOrderProductStatus === ORDER_PRODUCT_STATUS.preparing &&
    paymentsMethod === PAYMENTS_METHOD.bank_transfer
  ) {
    return {
      triggerText: '주문취소요청',
      headerTitle: '해당 상품주문을 취소요청 하시겠습니까?',
      description: '담당자가 확인 후 결제반환이 이루어지면 주문취소가 완료됩니다.',
      action: {
        text: '주문취소요청',
        onClick: () => {},
      },
    };
  }

  if (
    currentOrderProductStatus === ORDER_PRODUCT_STATUS.preparing &&
    paymentsMethod === PAYMENTS_METHOD.credit_card
  ) {
    return {
      triggerText: '주문취소',
      headerTitle: '해당 상품주문을을 취소하시겠습니까?',
      description: '선택하신 상품의 주문이 취소처리 됩니다',
      action: {
        text: '주문취소',
        onClick: () => {},
      },
    };
  }

  throw new BusinessLogicError('해당 상품주문상태에서는 부분 주문취소를 지원하지 않습니다');
};
