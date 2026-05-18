import { zodSafeParse } from '@/shared';
import {
  clientOrderListResponseSchema,
  clientOrderListSchema,
  GetClientOrderListResponse,
  ClientOrderDto,
} from '../model/schemas';

export class ClientOrderListMapper {
  public static toResponse(data: any): GetClientOrderListResponse {
    return zodSafeParse(clientOrderListResponseSchema, data);
  }

  public static responseToDto(data: GetClientOrderListResponse): ClientOrderDto[] {
    const orders = data.map((order) => ({ ...order, orderProducts: order.orderProducts.docs }));
    return zodSafeParse(clientOrderListSchema, orders);
  }
}
