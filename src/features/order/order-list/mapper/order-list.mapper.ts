import { ZodSchemaParser } from '@/shared';
import {
  AdminOrderListResult,
  ClientOrderListResult,
  GetAdminOrderListReponse,
  GetClientOrderListResponse,
} from '../types';
import { adminOrderListResultSchema, clientOrderListResultSchema } from '../schemas';

export class OrderListMapper {
  static toAdminOrderListResult(response: GetAdminOrderListReponse): AdminOrderListResult {
    if (!response.ok) {
      throw response.error;
    }

    const result = {
      totalCount: response.data.totalDocs,
      orders: response.data.docs.map((order) => {
        return {
          ...order,
          orderProducts: order.orderProducts?.docs,
        };
      }),
    } as AdminOrderListResult;
    return ZodSchemaParser.safeParseOrThrow(adminOrderListResultSchema, {
      data: result,
      errorMsg: '주문 리스트를 변환하는 과정에서 문제가 발생했습니다',
    });
  }

  static toClientOrderListResult(response: GetClientOrderListResponse) {
    if (!response.ok) {
      throw response.error;
    }

    const result = {
      orders: response.data.map((order) => {
        return {
          ...order,
          orderProducts: order.orderProducts?.docs,
        };
      }),
    } as ClientOrderListResult;
    return ZodSchemaParser.safeParseOrThrow(clientOrderListResultSchema, {
      data: result,
      errorMsg: '주문 리스트를 변환하는 과정에서 문제가 발생했습니다',
    });
  }
}
