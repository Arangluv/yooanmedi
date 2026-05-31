import { okWithData, failure, normalizeError } from '@/shared';
import { UserApiRepository, UserAdapter } from '@/entities/user/infrastructure';
import { ClientOrderListSearchParams, OrderListFindOption } from '../../lib';
import { ClientOrderListRepository } from '../../core';
import { ClientOrderListUseCase } from '../../usecase';
import { ClientOrderListMapper } from '../../mapper';

export const ClientOrderListService = (
  orderListRepository: ClientOrderListRepository,
): ClientOrderListUseCase => ({
  getOrderList: async (searchParams: ClientOrderListSearchParams) => {
    try {
      const userApiRepository = new UserApiRepository(UserAdapter());
      const user = await userApiRepository.findByHeader();
      const findOption = OrderListFindOption.clientOrderList.build({ user, searchParams });
      const orders = await orderListRepository.getOrderList(findOption);

      return okWithData({
        data: ClientOrderListMapper.responseToDto(orders),
      });
    } catch (error) {
      const { message } = normalizeError(error);
      return failure(message);
    }
  },
});
