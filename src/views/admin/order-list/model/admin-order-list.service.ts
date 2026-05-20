import { AdminOrderListItem } from '@/views/admin/order-list';
import { toOrders } from './admin-order-list.schema';
import { AdminOrderTotalCancelCommandFactory } from '@/features/order/order-cancel/model/command/total-cancel-command-factory';

export class AdminOrderListService {
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
