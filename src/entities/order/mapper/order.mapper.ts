import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { OrderEntity } from '../types';
import { orderSchema } from '../schemas';
import { ORDER_ERROR_MESSAGE } from '../constants';

export class OrderMapper {
  static entityToDomain(data: OrderEntity) {
    const dto = {
      data: { ...data, orderProducts: data.orderProducts?.docs },
      errorMsg: ORDER_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(orderSchema, dto);
  }
}
