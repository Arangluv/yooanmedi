import { FindOption, zodSafeParse } from '@/shared';
import { getAdminOrderList } from './order-list';
import { adminOrderListItemEntitiesSchema } from '../model/admin-order-list.schema';

export class AdminOrderListRepository {
  public static async findMany(option: FindOption) {
    const result = await getAdminOrderList(option);
    const orderEntities = zodSafeParse(adminOrderListItemEntitiesSchema, result.docs);
    return { orders: orderEntities, totalCount: result.totalDocs };
  }
}
