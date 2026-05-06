import { ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

const baseOrderTransition = {
  fromOrderStatus: ORDER_STATUS.pending,
  toStatus: ORDER_STATUS.preparing,
  fromOrderProductStatus: ORDER_PRODUCT_STATUS.pending,
  toOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
  successMessage: '주문상태가 상품준비 단계로 변경되었습니다',
  errorMessage: '주문상태를 변경하는데 문제가 발생했습니다',
};

export const createOrderTransitionFixture = (override?: Partial<typeof baseOrderTransition>) => {
  return {
    ...baseOrderTransition,
    ...override,
  };
};
