import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { OrderEntity } from '../types';
import { orderSchema, createdOrderSchema } from '../schemas';
import { ORDER_ERROR_MESSAGE } from '../constants';

export class OrderMapper {
  static toCreatedOrder(data: OrderEntity) {
    return ZodSchemaParser.safeParseOrThrow(createdOrderSchema, {
      data,
      errorMsg: ORDER_ERROR_MESSAGE.invalidData,
    });
  }

  static entityToDomain(data: OrderEntity) {
    const dto = {
      data: { ...data, orderProducts: data.orderProducts?.docs },
      errorMsg: ORDER_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(orderSchema, dto);
  }
}
