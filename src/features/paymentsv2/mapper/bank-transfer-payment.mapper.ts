import { PriceItemDto, ZodSchemaParser, priceItemListSchema } from '@/shared';
import {
  createOrderSchemaForBankTransfer,
  CreateOrderRequestForBankTransferDto,
  ORDER_STATUS,
  PAYMENT_STATUS,
  FLG_STATUS,
  Order,
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
} from '@/entities/point';
import { CartItem } from '@/entities/cart-item';
import { UpdateUserDto, updateUserSchema, User } from '@/entities/user';
import { BankTransferPaymentCommandDto, PaymentOrderItemDto } from '../dto';
import { PAYMENT_ERROR_MESSAGE } from '../core';

export class BankTransferPaymentMapper {
  static toCreateOrderDto(
    dto: BankTransferPaymentCommandDto,
  ): CreateOrderRequestForBankTransferDto {
    return ZodSchemaParser.safeParseOrThrow(createOrderSchemaForBankTransfer, {
      data: {
        orderRequest: dto.user.deliveryRequest,
        user: dto.user.id,
        usedPoint: dto.user.usedPoint,
        orderNo: dto.paymentInfo.shopOrderNo,
        finalPrice: dto.paymentInfo.totalAmount,
        paymentsMethod: dto.paymentInfo.paymentMethod,
        orderStatus: ORDER_STATUS.pending,
        paymentStatus: PAYMENT_STATUS.pending,
        flgStatus: FLG_STATUS.init_normal,
      } as CreateOrderRequestForBankTransferDto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createOrder,
    });
  }

  static toCreateOrderProductDto(
    order: Order,
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
        orderProductStatus: ORDER_PRODUCT_STATUS.pending,
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
    dto: BankTransferPaymentCommandDto;
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

  static toUpdateUserPointDtoForUse({
    user,
    histories,
  }: {
    user: User;
    histories: PointHistory[];
  }): UpdateUserDto {
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

  static toPriceItems(data: CartItem[]): PriceItemDto[] {
    const dto: PriceItemDto[] = data.map((item) => {
      return {
        id: item.product.id,
        product: {
          is_cost_per_unit: item.product.is_cost_per_unit,
          is_free_delivery: item.product.is_free_delivery,
          price: item.product.price,
          delivery_fee: item.product.delivery_fee,
        },
        quantity: item.quantity,
      };
    });
    return ZodSchemaParser.safeParseOrThrow(priceItemListSchema, {
      data: dto,
      errorMsg: PAYMENT_ERROR_MESSAGE.createContext,
    });
  }
}
