import {
  type CreateOrderEntity,
  type CreateOrderResponseDto,
} from '../model/schemas/create-order.schema';
import {
  orderEntitiesSchema,
  orderEntitySchema,
  toOrderListResultSchema,
  toOrderSchema,
  type Order,
  type UpdateOrderDto,
} from '../model/schemas/order.schema';
import { getOrderList, getOrder, updateOrder, createOrder } from './order';
import { FindOption, zodSafeParse } from '@/shared';

export class OrderRepository {
  public static async create(entity: CreateOrderEntity): Promise<CreateOrderResponseDto> {
    return await createOrder(entity);
  }

  public static async update(orderId: number, data: UpdateOrderDto) {
    await updateOrder(orderId, data);
  }

  public static async findOne(orderId: number): Promise<Order> {
    const order = await getOrder(orderId);
    const orderEntity = zodSafeParse(orderEntitySchema, order);

    return toOrderSchema(orderEntity);
  }

  public static async findMany(option: FindOption) {
    const { docs, totalDocs } = await getOrderList(option);
    const orderEntities = zodSafeParse(orderEntitiesSchema, docs);
    return toOrderListResultSchema(orderEntities, totalDocs);
  }
}
