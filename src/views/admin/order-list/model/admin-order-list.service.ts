import { type OrderStatus } from '@/entities/order';
import { AdminOrderListItem, AdminOrderListResult } from '@/views/admin/order-list';
import { entityToOrderListItem, toOrders } from './admin-order-list.schema';
import { AdminOrderTotalCancelCommandFactory } from '@/features/order/order-cancel/model/command/total-cancel-command-factory';
import { OrderListFindOption } from '../lib/find-options';
import { AdminOrderListRepository } from '../api/repository';

interface AdminOrderListRequestDto {
  page: number;
  orderStatus: OrderStatus | 'all';
}

export class AdminOrderListService {
  public async getOrderList(dto: AdminOrderListRequestDto): Promise<AdminOrderListResult> {
    try {
      const option = OrderListFindOption.build(dto);
      const result = await AdminOrderListRepository.findMany(option);

      return entityToOrderListItem(result.orders, result.totalCount);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async totalCancelOrders(orders: AdminOrderListItem[]) {
    try {
      const orderEntities = toOrders(orders);
      for (const order of orderEntities) {
        const cancelCommand = AdminOrderTotalCancelCommandFactory.createCommand(order);
        await cancelCommand.execute();
      }
    } catch (error) {
      throw error;
    }
  }
}
