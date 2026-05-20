import { okWithData, failure, normalizeError } from '@/shared';
import { OrderDetailUseCase } from '../usecase';
import { OrderDetailRepository } from '../repository';
import { OrderDetailFindOption } from '../lib';
import { OrderDetailMapper } from '../mapper';

export const OrderDetailService = (repository: OrderDetailRepository): OrderDetailUseCase => ({
  getOrderDetail: async (orderId: number) => {
    try {
      const options = OrderDetailFindOption.build();
      const response = await repository.getOrderDetail(orderId, options);
      return okWithData({ data: OrderDetailMapper.toDto(response) });
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
});
