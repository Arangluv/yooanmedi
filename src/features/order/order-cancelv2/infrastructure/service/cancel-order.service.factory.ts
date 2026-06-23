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
import { CancelOrderServiceDependencies } from '../../core';
import { AdminCancelOrderService } from './admin.cancel-order.service';
import { ClientCancelOrderService } from './client-cancel-order.service';

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
  } as CancelOrderServiceDependencies;
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
  } as CancelOrderServiceDependencies;
  return ClientCancelOrderService(dependencies);
};
