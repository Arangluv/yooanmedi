'use server';

import { transformOrderListToInventory } from '@/entities/inventory';
import { createUsePointTransaction } from '@/entities/point';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price';
import { createOrder, CreateOrderDto, ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';
import { getNowISOString } from '@/shared'; // TODO :: REMOVE
import {
  createOrderProduct,
  CreateOrderProductDto,
  ORDER_PRODUCT_STATUS,
} from '@/entities/order-product';
import {
  createRecentPurchasedHistory,
  CreateRecentPurchasedHistoryDto,
} from '@/entities/recent-purchased-history';

import { PointAllocator } from '@/entities/point/lib/use/point-use-allocator';
import { type OrderBankTransferDto } from '../model/order-banktransfer-schema';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';

export const orderBankTransfer = async (dto: OrderBankTransferDto) => {
  try {
    const { shopOrderNo, deliveryRequest, orderList, usedPoint, userId, minOrderPrice, amount } =
      dto;

    const inventory = await transformOrderListToInventory(orderList);
    const totalPriceWithoutDeliveryFee = inventory.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    const freeDeliveryFlg = totalPriceWithoutDeliveryFee >= minOrderPrice;
    const pointAllocator = new PointAllocator(inventory, usedPoint, freeDeliveryFlg);

    // 주문 생성
    const DEFAULT_ORDER_DELIVERY_FEE = 0;
    const orderDto = {
      user: userId,
      orderNo: shopOrderNo,
      orderStatus: ORDER_STATUS.PENDING,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.PENDING,
      orderRequest: deliveryRequest,
      finalPrice: amount,
      orderDeliveryFee: DEFAULT_ORDER_DELIVERY_FEE,
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
      usedPoint: usedPoint,
    } as CreateOrderDto;

    const order = await createOrder({
      dto: orderDto,
    });

    for (let i = 0; i < inventory.length; i++) {
      const inventoryItem = inventory[i];
      const productDeliveryFee = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });

      let totalProductAmount =
        inventoryItem.product.price * inventoryItem.quantity + productDeliveryFee;

      totalProductAmount -= pointAllocator.getAllocatedPoint(inventoryItem.product.id);

      // 주문 상품 생성
      const createOrderProductDto: CreateOrderProductDto = {
        order: order.id,
        product: inventoryItem.product.id,
        orderProductStatus: ORDER_PRODUCT_STATUS.PENDING,
        priceSnapshot: inventoryItem.product.price,
        productNameSnapshot: inventoryItem.product.name,
        totalAmount: totalProductAmount,
        productDeliveryFee: productDeliveryFee,
        quantity: inventoryItem.quantity,
        cashback_rate: inventoryItem.product.cashback_rate,
        cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
      };

      const orderProduct = await createOrderProduct({
        dto: createOrderProductDto,
      });

      // 히스토리 생성
      const createRecentPurchasedHistoryDto: CreateRecentPurchasedHistoryDto = {
        user: userId,
        product: inventoryItem.product.id,
        quantity: inventoryItem.quantity,
        amount: inventoryItem.product.price,
      };
      await createRecentPurchasedHistory(createRecentPurchasedHistoryDto);

      // 사용 포인트 차감
      if (usedPoint) {
        await createUsePointTransaction({
          userId,
          orderProductId: orderProduct.id,
          amount: pointAllocator.getAllocatedPoint(inventoryItem.product.id),
        });
      }
    }

    return {
      success: true,
      message: '무통장 입금 주문을 생성하였습니다.',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: '무통장 입금 주문을 생성하는데 실패했습니다. 다시 시도해주세요.',
    };
  }
};
