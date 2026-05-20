import {
  OrderDetailDto,
  OrderDetailResponse,
  orderDetailResponseSchema,
  orderDetailSchema,
} from '../schemas';
import { zodSafeParse } from '@/shared';

export class OrderDetailMapper {
  public static toResponse(data: any): OrderDetailResponse {
    return zodSafeParse(orderDetailResponseSchema, data);
  }

  public static toDto(response: OrderDetailResponse): OrderDetailDto {
    const dto = { ...response, orderProducts: response.orderProducts.docs };
    return zodSafeParse(orderDetailSchema, dto);
  }
}
