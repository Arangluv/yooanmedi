import { ZodSchemaParser } from '@/shared';
import { GetOrderDetailResponse } from '../types';
import { orderDetailSchema } from '../schemas';
import { OrderDetailDto } from '../dto';

export class OrderDetailMapper {
  static responseToDto(response: GetOrderDetailResponse): OrderDetailDto {
    if (!response.ok) {
      throw response.error;
    }

    return ZodSchemaParser.safeParseOrThrow(orderDetailSchema, {
      data: {
        ...response.data,
        orderProducts: response.data.orderProducts?.docs,
      } as OrderDetailDto,
      errorMsg: '주문 상세내역으로 변환하는 과정에서 문제가 발생했습니다',
    });
  }
}
