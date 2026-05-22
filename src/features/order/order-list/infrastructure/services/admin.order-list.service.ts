import { okWithData, failure, normalizeError } from '@/shared';
import { AdminOrderListSearchParams, OrderListFindOption } from '../../lib';
import { AdminOrderListUseCase } from '../../usecase';
import { AdminOrderListRepository } from '../../core';
import { AdminOrderListMapper } from '../../mapper';

export const AdminOrderListService = (
  orderListRepository: AdminOrderListRepository,
): AdminOrderListUseCase => ({
  getOrderList: async (searchParams: AdminOrderListSearchParams) => {
    try {
      const findOption = OrderListFindOption.adminOrderList.build(searchParams);
      const orders = await orderListRepository.getOrderList(findOption);
      return okWithData({
        data: AdminOrderListMapper.responsetoDto(orders),
      });
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
});
