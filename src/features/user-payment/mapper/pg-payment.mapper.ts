import { PAYMENTS_METHOD, PriceItemDto, ZodSchemaParser, priceItemListSchema } from '@/shared';
import {
  createOrderSchemaForPG,
  CreateOrderRequestForPgDto,
  ORDER_STATUS,
  PAYMENT_STATUS,
  FLG_STATUS,
  OperatorResultOrder,
} from '@/entities/order';
import {
  CreateOrderProductRequestDto,
  createOrderProductSchema,
  ORDER_PRODUCT_STATUS,
  OrderProduct,
} from '@/entities/order-product';
import {
  CreatePurchasedHistoryRequestDto,
  createPurchasedHistoryRequestSchema,
} from '@/entities/purchased-history';
import {
  CreatePointSchema,
  CreateUsagePointHistoryRequestDto,
  POINT_ACTION,
  PointCalculator,
  PointHistory,
  PointItem,
  pointItemSchema,
} from '@/entities/point';
import { UpdateUserDto, updateUserSchema, User } from '@/entities/user';
import {
  EasyPayApprovePaymentRequestDto,
  EasyPayPaymentApprovalResult,
  EasyPayPaymentApprovalSchemas,
} from '@/entities/easypay';
import { CreatePaymentHistorRequestyDto, createPaymentHistorySchema } from '@/entities/payment';
import { Product } from '@/entities/product';
import { PGPaymentCommandDto, PaymentOrderItemDto } from '../dto';
import { PAYMENT_ERROR_MESSAGE } from '../core';

export class PGPaymentMapper {
  static toCreateOrderDto(dto: PGPaymentCommandDto): CreateOrderRequestForPgDto {
    return ZodSchemaParser.safeParseOrThrow(createOrderSchemaForPG, {
      data: {
        orderRequest: dto.user.deliveryRequest,
        user: dto.user.id,
        usedPoint: dto.user.usedPoint,
        orderNo: dto.paymentInfo.shopOrderNo,
        finalPrice: dto.paymentInfo.totalAmount,
        paymentsMethod: dto.paymentInfo.paymentMethod,
        orderStatus: ORDER_STATUS.preparing,
        paymentStatus: PAYMENT_STATUS.complete,
        flgStatus: FLG_STATUS.init_normal,
      } as CreateOrderRequestForPgDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createOrder,
    });
  }

  static toCreateOrderProductDto(
    order: OperatorResultOrder,
    dto: PaymentOrderItemDto,
  ): CreateOrderProductRequestDto {
    return ZodSchemaParser.safeParseOrThrow(createOrderProductSchema, {
      data: {
        product: dto.product.id,
        cashback_rate: dto.product.cashback_rate,
        cashback_rate_for_bank: dto.product.cashback_rate_for_bank,
        quantity: dto.quantity,
        totalAmount: dto.totalAmount,
        order: order.id,
        productDeliveryFee: dto.deliveryFee,
        priceSnapshot: dto.product.price,
        productNameSnapshot: dto.product.name,
        orderProductStatus: ORDER_PRODUCT_STATUS.preparing,
      } as CreateOrderProductRequestDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createOrderProduct,
    });
  }

  static toPurchasedHistoryDto(
    user: number,
    dto: PaymentOrderItemDto,
  ): CreatePurchasedHistoryRequestDto {
    return ZodSchemaParser.safeParseOrThrow(createPurchasedHistoryRequestSchema, {
      data: {
        user,
        product: dto.product.id,
        quantity: dto.quantity,
        amount: dto.product.price,
      } as CreatePurchasedHistoryRequestDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createPurchasedHistory,
    });
  }

  static toCreateUsePointHistoryDto({
    dto,
    orderItem,
    orderProduct,
  }: {
    dto: PGPaymentCommandDto;
    orderItem: PaymentOrderItemDto;
    orderProduct: OrderProduct;
  }): CreateUsagePointHistoryRequestDto {
    return ZodSchemaParser.safeParseOrThrow(CreatePointSchema.usage.request, {
      data: {
        user: dto.user.id,
        orderProduct: orderProduct.id,
        amount: orderItem.usedPoint,
        type: POINT_ACTION.use,
      } as CreateUsagePointHistoryRequestDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createUsePointHistory,
    });
  }

  static orderItemtoPointItem(orderItem: PaymentOrderItemDto): PointItem {
    return ZodSchemaParser.safeParseOrThrow(pointItemSchema, {
      data: {
        rates: {
          creditCard: orderItem.product.cashback_rate,
          bankTransfer: orderItem.product.cashback_rate_for_bank,
        },
        quantity: orderItem.quantity,
        price: orderItem.product.price,
      } as PointItem,
      errorMsg: 'orderItem을 pointItem으로 변환하는 과정에서 문제가 발생했습니다',
    });
  }

  static toCreateEarnPointHistoryDto({
    dto,
    orderProduct,
    pointItem,
  }: {
    dto: PGPaymentCommandDto;
    orderProduct: OrderProduct;
    pointItem: PointItem;
  }): CreateUsagePointHistoryRequestDto {
    const earnedPoint = PointCalculator.forCardWithQuantity(pointItem);

    return ZodSchemaParser.safeParseOrThrow(CreatePointSchema.usage.request, {
      data: {
        user: dto.user.id,
        orderProduct: orderProduct.id,
        amount: earnedPoint,
        type: POINT_ACTION.earn,
      } as CreateUsagePointHistoryRequestDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createUsePointHistory,
    });
  }

  static toUpdateUserPointDtoForUse({
    user,
    histories,
  }: {
    user: User;
    histories: PointHistory[];
  }) {
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistories(histories),
      action: POINT_ACTION.use,
    });

    return ZodSchemaParser.safeParseOrThrow(updateUserSchema, {
      data: {
        user: user.id,
        data: {
          point: updatedPoint,
        },
      } as UpdateUserDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.subtractUserPoint,
    });
  }

  static toUpdateUserPointDtoForEarn({
    user,
    histories,
  }: {
    user: User;
    histories: PointHistory[];
  }) {
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistories(histories),
      action: POINT_ACTION.earn,
    });

    return ZodSchemaParser.safeParseOrThrow(updateUserSchema, {
      data: {
        user: user.id,
        data: {
          point: updatedPoint,
        },
      } as UpdateUserDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.subtractUserPoint,
    });
  }

  static toApprovePaymentDto(dto: PGPaymentCommandDto): EasyPayApprovePaymentRequestDto {
    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentApprovalSchemas.requestDto, {
      data: {
        authorizationId: dto.paymentInfo.authorizationId,
        shopOrderNo: dto.paymentInfo.shopOrderNo,
      } as EasyPayApprovePaymentRequestDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.approvePayment,
    });
  }

  static toCreatePaymentHistoryDto({
    order,
    approvalResult,
  }: {
    order: OperatorResultOrder;
    approvalResult: EasyPayPaymentApprovalResult;
  }): CreatePaymentHistorRequestyDto {
    return ZodSchemaParser.safeParseOrThrow(createPaymentHistorySchema, {
      data: {
        order: order.id,
        pgCno: approvalResult.pgCno,
        amount: approvalResult.amount,
        paymentsMethod: PAYMENTS_METHOD.credit_card,
      } as CreatePaymentHistorRequestyDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createPaymentHistory,
    });
  }

  static toPrcieItems(data: Array<{ product: Product; quantity: number }>): PriceItemDto[] {
    const dto = data.map((item) => {
      return {
        id: item.product.id,
        product: {
          price: item.product.price,
          delivery_fee: item.product.delivery_fee,
          is_cost_per_unit: item.product.is_cost_per_unit,
          is_free_delivery: item.product.is_free_delivery,
        },
        quantity: item.quantity,
      } as PriceItemDto;
    });
    return ZodSchemaParser.safeParseOrThrow(priceItemListSchema, {
      data: dto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createContext,
    });
  }
}
