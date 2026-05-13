import { zodSafeParse } from '@/shared';
import { OrderService } from '@/entities/order/infrastructure';
import { OrderProductFindOption, OrderProductComposer } from '@/entities/order-product';
import { OrderProductService } from '@/entities/order-product/infrastructure';
import { adminOrderDetailSchema, toOrder } from './order-detail.schema';
import { ProductFindOption } from '@/entities/product';
import { ProductService } from '@/entities/product/infrastructure';
import { type OrderProductWithProduct } from '@/entities/order-product/model/order-product-composer';
import { OrderComposer } from '@/entities/order';
import { UserService } from '@/entities/user/infrastructure';
import { AdminPartialOrderCancelRequestDto } from '../api/order-detail.api';
import { AdminOrderPartialCancelCommandFactory } from '@/features/order/order-cancel/model/command/partial-cancel-command-factory';

export class AdminOrderDetailService {
  public async getOrderDetail(orderId: number) {
    const orderService = new OrderService();
    const order = await orderService.getOrder(orderId);

    const userService = new UserService();
    const userMap = await userService.getUserMap([order.user]);
    const orderWithUser = OrderComposer.detail.withUser(order, userMap);

    const orderProductService = new OrderProductService();
    const orderProductFindOption = OrderProductFindOption.adminOrderDetail.build(orderId);
    const orderProducts = await orderProductService.getOrderProducts(orderProductFindOption);

    const productService = new ProductService();
    const targetProductIds = orderProducts.map((orderProduct) => orderProduct.product);
    const productFindOption = ProductFindOption.adminOrderDetail.build(targetProductIds);
    const productMap = await productService.getProductMap(productFindOption);

    const orderProductWithProduct = OrderProductComposer.list.withProduct(
      orderProducts,
      productMap,
    );
    const orderProductMap = new Map<number, OrderProductWithProduct>();
    for (const orderProduct of orderProductWithProduct) {
      orderProductMap.set(orderProduct.id, orderProduct);
    }

    const orderWithOrderProduct = OrderComposer.detail.withOrderProduct(
      orderWithUser,
      orderProductMap,
    );

    return zodSafeParse(adminOrderDetailSchema, orderWithOrderProduct);
  }

  public async partialCancelOrder(dto: AdminPartialOrderCancelRequestDto) {
    try {
      const orderEntity = toOrder(dto.order);
      const strategy = AdminOrderPartialCancelCommandFactory.getCancelStrategy(orderEntity);
      const cancelCommand = AdminOrderPartialCancelCommandFactory.createCommand({
        strategy,
        order: orderEntity,
        orderProductId: dto.targetOrderProductId,
      });

      await cancelCommand.execute();
    } catch (error) {
      throw error;
    }
  }
}
