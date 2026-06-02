import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { orderProductSchema, orderProductsSchema } from '../schemas';
import { ORDER_PRODUCT_ERROR_MESSAGE } from '../constants';
import { OrderProductEntity } from '../types';

export class OrderProductMapper {
  static reponseToDto(data: OrderProductEntity) {
    const dto = {
      data,
      errorMsg: ORDER_PRODUCT_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(orderProductSchema, dto);
  }

  static reponseToDtoList(data: OrderProductEntity[]) {
    const dto = {
      data,
      errorMsg: ORDER_PRODUCT_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;

    return ZodSchemaParser.safeParseOrThrow(orderProductsSchema, dto);
  }
}
