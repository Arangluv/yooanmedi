import { BaseError, BaseErrorManager } from '@/shared';
import { OrderDetailRepository } from '../../core';
import { GetOrderDetailRequestDto } from '../../dto';
import { OrderDetailUsecase } from '../../usecases';

export interface OrderDetailServiceDependencies {
  repository: {
    orderDetail: OrderDetailRepository;
  };
}

export const OrderDetailService = ({
  repository,
}: OrderDetailServiceDependencies): OrderDetailUsecase => ({
  getOrderDetail: async (dto: GetOrderDetailRequestDto) => {
    try {
      return await repository.orderDetail.getOrderDetail(dto);
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw new BaseError({
        clientMsg: message ?? '주문상세내역을 불러오는데 문제가 발생했습니다',
        errorName: 'OrderDetailServiceError',
      });
    }
  },
});
