import { zodSafeParse } from '@/shared';
import { OrderFindOption, type OrderStatus, OrderComposer } from '@/entities/order';
import { OrderService } from '@/entities/order/infrastructure';
import { UserService } from '@/entities/user/model/user.service';
import { AdminOrderListResult, adminOrderListResultSchema } from '@/views/admin/order-list';

interface AdminOrderListRequestDto {
  page: number;
  orderStatus: OrderStatus | 'all';
}

export class AdminOrderListService {
  public async getOrderList(dto: AdminOrderListRequestDto): Promise<AdminOrderListResult> {
    const orderService = new OrderService();
    const option = OrderFindOption.adminOrderList.build(dto);
    const { orders, totalCount } = await orderService.getOrderList(option);

    const userService = new UserService();
    const userIds = orders.map((order) => order.user);
    const userMap = await userService.getUserMap(userIds);

    const ordersWithUser = OrderComposer.list.withUser(orders, userMap);
    return zodSafeParse(adminOrderListResultSchema, {
      orders: ordersWithUser,
      totalCount,
    });
  }
}
