import { type FindOption } from '@/shared';
import { getOrderList } from './order-list';

export class OrderListRepository {
  public static async findMany(option: FindOption) {
    return await getOrderList(option);
  }
}
