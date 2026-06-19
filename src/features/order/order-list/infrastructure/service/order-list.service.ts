import { BaseErrorManager } from '@/shared';
import { UserRepository } from '@/entities/user';
import { OrderListFindOption } from '../libs';
import { OrderListUsecase } from '../../usecases';
import { GetAdminOrderListRequestDto, GetClientOrderListRequestDto } from '../../dto';
import { OrderListRepository } from '../../core';
import { OrderListError } from '../../core/libs';

export interface OrderListServiceDependencies {
  repository: {
    orderList: OrderListRepository;
    user: UserRepository;
  };
}

export const OrderListService = ({
  repository,
}: OrderListServiceDependencies): OrderListUsecase => ({
  getAdminOrderList: async (dto: GetAdminOrderListRequestDto) => {
    try {
      const option = OrderListFindOption.admin(dto);
      return await repository.orderList.findMandForAdmin(option);
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      OrderListError.getListFail(message ?? '주문리스트를 가져오는데 문제가 발생했습니다');
    }
  },

  getClientOrderList: async (dto: GetClientOrderListRequestDto) => {
    try {
      const user = await repository.user.findByHeader();
      const option = OrderListFindOption.client({ searchParams: dto, user });
      return await repository.orderList.findMandForClient(option);
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      OrderListError.getListFail(message ?? '주문리스트를 가져오는데 문제가 발생했습니다');
    }
  },
});
