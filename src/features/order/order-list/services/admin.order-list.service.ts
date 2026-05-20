import { okWithData, failure } from '@/shared';
import { AdminOrderListUseCase } from '../usecase/order-list.usecase';
import { AdminOrderListRepository } from '../repository';
import { AdminOrderListSearchParams, OrderListFindOption } from '../lib';
import { AdminOrderListMapper } from '../mapper';

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
      throw new Error('여기서 에러 정의');
    }
  },
});
