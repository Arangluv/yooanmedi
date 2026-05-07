import {
  type CreateOrderEntity,
  type CreateOrderResponseDto,
} from '../model/schemas/create-order.schema';
import {
  orderEntityListSchema,
  orderEntitySchema,
  toOrderListResultSchema,
  toOrderSchema,
  type Order,
  type UpdateOrderDto,
  type OrderListResult,
} from '../model/schemas/order.schema';
import { getOrders, updateOrder, createOrder } from './order';
import { FindOption, zodSafeParse } from '@/shared';

export class OrderRepository {
  public static async create(entity: CreateOrderEntity): Promise<CreateOrderResponseDto> {
    return await createOrder(entity);
  }

  public static async update(orderId: number, data: UpdateOrderDto) {
    await updateOrder(orderId, data);
  }

  public static async findOne(option: FindOption): Promise<Order> {
    const { docs } = await getOrders(option);
    const UNIQUE_INDEX = 0;
    const orderEntity = zodSafeParse(orderEntitySchema, docs[UNIQUE_INDEX]);

    return toOrderSchema(orderEntity);
  }

  public static async findMany(option: FindOption): Promise<OrderListResult> {
    const { docs, totalDocs } = await getOrders(option);
    const orderListEntity = zodSafeParse(orderEntityListSchema, docs);
    return toOrderListResultSchema(orderListEntity, totalDocs);
  }
}
