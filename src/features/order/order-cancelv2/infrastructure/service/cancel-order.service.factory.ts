import { getPayload } from '@/shared/server';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { EasyPayAdapter, EasyPayApiRepository } from '@/entities/easypay/infrastructure';
import {
  PaymentHistoryAdapter,
  PaymentHistoryApiRepository,
} from '@/entities/payment/infrastructure';
import {
  AdminCancelOrderService,
  AdminOrderServiceDependencies,
} from './admin.cancel-order.service';
import {
  ClientCancelOrderService,
  ClientCancelOrderServiceDependencies,
} from './client-cancel-order.service';

export const createAdminCancelOrderUseCase = async () => {
  const payload = await getPayload();
  const dependencies = {
    payload,
    repository: {
      order: new OrderApiRepository(OrderAdapter()),
      orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
      pointHistory: new PointHistoryApiRepository(PointHistoryAdapter()),
      user: new UserApiRepository(UserAdapter()),
      easyPay: new EasyPayApiRepository(EasyPayAdapter()),
      paymentHistory: new PaymentHistoryApiRepository(PaymentHistoryAdapter()),
    },
  } as AdminOrderServiceDependencies;
  return AdminCancelOrderService(dependencies);
};

export const createClientCancelOrderUseCase = async () => {
  const payload = await getPayload();
  const dependencies = {
    payload,
    repository: {
      order: new OrderApiRepository(OrderAdapter()),
      orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
      pointHistory: new PointHistoryApiRepository(PointHistoryAdapter()),
      user: new UserApiRepository(UserAdapter()),
      easyPay: new EasyPayApiRepository(EasyPayAdapter()),
      paymentHistory: new PaymentHistoryApiRepository(PaymentHistoryAdapter()),
    },
  } as ClientCancelOrderServiceDependencies;
  return ClientCancelOrderService(dependencies);
};
