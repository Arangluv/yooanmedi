import { UserRepository } from '@/entities/user/infrastructure';
import { ClientOrderListSearchParams } from '../lib/generate-search-param';
import { OrderListRepository } from '../api/repository';
import { OrderListFindOption } from '../lib/find-options';
import { toClientOrderList } from './order-list.schema';

export interface IOrderListService {
  getClientOrderList: (params: any) => Promise<any>;
}

export class OrderListService implements IOrderListService {
  public async getClientOrderList(searchParams: ClientOrderListSearchParams) {
    const user = await UserRepository.findByHeader();
    const findOption = OrderListFindOption.clientOrderList.build({ user, searchParams });
    const orders = await OrderListRepository.findMany(findOption);

    return toClientOrderList(orders);
  }
}
