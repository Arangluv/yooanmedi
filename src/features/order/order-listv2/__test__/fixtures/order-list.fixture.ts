import { PayloadAdapterResultManager } from '@/shared/server';
import {
  GetAdminOrderListReponse,
  GetClientOrderListResponse,
  AdminOrderListItem,
  ClientOrderListItem,
} from '../../types';
import { createOrderEntityFixture } from '@/entities/order/__test__';
import { createUserFixture } from '@/entities/user/__test__';
import { OrderEntity } from '@/entities/order';
import { TestErrorHelper } from '@/shared';

export const OrderListItemFixtures = {
  admin: {
    ...createOrderEntityFixture(),
    user: createUserFixture(),
    orderProducts: [
      { id: 1, orderProductStatus: 'preparing' },
      { id: 2, orderProductStatus: 'preparing' },
      { id: 3, orderProductStatus: 'preparing' },
    ],
  } as AdminOrderListItem,

  client: {
    ...createOrderEntityFixture(),
    user: createUserFixture(),
    orderProducts: [
      {
        id: 1,
        productNameSnapshot: 'test-product',
        priceSnapshot: 3000,
        quantity: 3,
        productDeliveryFee: 2500,
        orderProductStatus: 'cancel_request',
        product: {
          id: 1,
          manufacturer: 'test-manufacturer',
          insurance_code: 'test-ins',
          image: null,
        },
      },
    ],
  } as ClientOrderListItem,

  adminResponse: {
    ...createOrderEntityFixture(),
    user: createUserFixture(),
    orderProducts: {
      docs: [
        { id: 1, orderProductStatus: 'preparing' },
        { id: 2, orderProductStatus: 'preparing' },
        { id: 3, orderProductStatus: 'preparing' },
      ],
    },
  } as OrderEntity,

  clientResponse: {
    ...createOrderEntityFixture(),
    user: createUserFixture(),
    orderProducts: {
      docs: [
        {
          id: 1,
          productNameSnapshot: 'test-product',
          priceSnapshot: 3000,
          quantity: 3,
          productDeliveryFee: 2500,
          orderProductStatus: 'cancel_request',
          product: {
            id: 1,
            manufacturer: 'test-manufacturer',
            insurance_code: 'test-ins',
            image: null,
          },
        },
      ],
    },
  } as OrderEntity,
};

export const OrderListResponseFixture = {
  success: {
    admin: PayloadAdapterResultManager.okWithPaginated({
      docs: [OrderListItemFixtures.adminResponse, OrderListItemFixtures.adminResponse],
      totalDocs: 2,
    } as any) as GetAdminOrderListReponse,

    client: PayloadAdapterResultManager.ok([
      OrderListItemFixtures.clientResponse,
      OrderListItemFixtures.clientResponse,
    ] as any) as GetClientOrderListResponse,
  },
  fail: {
    admin: PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
    client: PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
  },
};
