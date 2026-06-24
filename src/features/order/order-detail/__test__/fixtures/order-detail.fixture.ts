import { PayloadOrderProduct, PayloadProduct } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { OrderEntity } from '@/entities/order';
import {
  createOrderProductEntityFixture,
  createOrderProductFixture,
} from '@/entities/order-product/__test__';
import { createOrderEntityFixture, createOrderFixture } from '@/entities/order/__test__';
import { createProductEntityFixture, createProductFixture } from '@/entities/product/__test__';
import { OrderDetailDto } from '../../dto';
import { createUserFixture, createUserResponseFixture } from '@/entities/user/__test__';

export const OrderDetailFixtures = {
  response: PayloadAdapterResultManager.ok(
    createOrderEntityFixture({
      user: createUserResponseFixture(),
      orderProducts: {
        docs: [
          createOrderProductEntityFixture({
            id: 1,
            product: createProductEntityFixture({ id: 1 }) as PayloadProduct,
            order: {
              id: 1,
            } as OrderEntity,
          }) as PayloadOrderProduct,
          createOrderProductEntityFixture({
            id: 2,
            product: createProductEntityFixture({ id: 2 }) as PayloadProduct,
            order: {
              id: 1,
            } as OrderEntity,
          }) as PayloadOrderProduct,
          createOrderProductEntityFixture({
            id: 3,
            product: createProductEntityFixture({ id: 3 }) as PayloadProduct,
            order: {
              id: 1,
            } as OrderEntity,
          }) as PayloadOrderProduct,
        ],
      },
    }) as OrderEntity,
  ),

  dto: createOrderFixture({
    user: createUserFixture() as any,
    orderProducts: [
      createOrderProductFixture({
        id: 1,
        order: {
          id: 1,
        } as OrderEntity,
        product: createProductFixture({ id: 1 }),
      } as any) as any,
      createOrderProductFixture({
        id: 2,
        order: {
          id: 2,
        } as OrderEntity,
        product: createProductFixture({ id: 2 }),
      } as any) as any,
      createOrderProductFixture({
        id: 3,
        order: {
          id: 3,
        } as OrderEntity,
        product: createProductFixture({ id: 3 }),
      } as any) as any,
    ],
  }) as unknown as OrderDetailDto,
};
