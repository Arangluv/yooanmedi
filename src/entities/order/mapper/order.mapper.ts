import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { OperatorResultOrder, OrderEntity } from '../types';
import { orderSchema, operatorResultOrderSchema } from '../schemas';
import { ORDER_ERROR_MESSAGE } from '../constants';

export class OrderMapper {
  static toCreatedOrder(data: OrderEntity) {
    return ZodSchemaParser.safeParseOrThrow(operatorResultOrderSchema, {
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

  static toOperatorResult(data: OrderEntity): OperatorResultOrder {
    return ZodSchemaParser.safeParseOrThrow(operatorResultOrderSchema, {
      data,
      errorMsg: ORDER_ERROR_MESSAGE.invalidData,
    });
  }
}
