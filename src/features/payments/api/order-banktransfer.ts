'use server';

import { transformOrderListToInventory } from '@/entities/inventory';
import { createUsePointTransaction } from '@/entities/point';
import { createOrder } from '@/entities/order';
import { DeliveryInfoManager } from '@/entities/inventory/lib/delivery-info-manager';
import {
  createOrderProduct,
  CreateOrderProductDto,
  ORDER_PRODUCT_STATUS,
} from '@/entities/order-product';
import {
  createRecentPurchasedHistory,
  CreateRecentPurchasedHistoryDto,
} from '@/entities/recent-purchased-history';

import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import { type OrderBankTransferDto } from '../model/order-banktransfer-schema';
import { buildBankTransferOrderDto } from '../lib/build-payments-dto';
import { OrderProductsManager } from '../lib/process-order-products';

export const orderBankTransfer = async (dto: OrderBankTransferDto) => {
  try {
    const { userId, shopOrderNo, deliveryRequest } = dto;
    const { usedPoint, amount } = dto;
    const { orderList, minOrderPrice } = dto;

    // 주문 생성
    const orderDto = buildBankTransferOrderDto({
      user: userId,
      orderNo: shopOrderNo,
      orderRequest: deliveryRequest,
      finalPrice: amount,
      usedPoint,
    });
    const order = await createOrder({ dto: orderDto });

    // const inventory = await transformOrderListToInventory(orderList);
    // const deliveryInfoManager = new DeliveryInfoManager(inventory, minOrderPrice);
    // const pointAllocator = new PointAllocator(deliveryInfoManager, usedPoint);

    // 주문 사이드 이펙트 처리
    const orderProductsManager = await OrderProductsManager.create(dto, order.id);
    await orderProductsManager.processOrderSideEffectsForBankTransfer();

    // 주문 상품 생성
    // for (let i = 0; i < inventory.length; i++) {
    //   const inventoryItem = inventory[i];
    //   const orderProductSubtotal = deliveryInfoManager.getOrderProductSubtotal(inventoryItem);
    //   const orderProductTotalAmount =
    //     orderProductSubtotal - pointAllocator.getAllocatedPoint(inventoryItem.product.id);

    //   const createOrderProductDto: CreateOrderProductDto = {
    //     order: order.id,
    //     totalAmount: orderProductTotalAmount,
    //     productDeliveryFee: deliveryInfoManager.getOrderProductDeliveryFee(inventoryItem),

    //     orderProductStatus: ORDER_PRODUCT_STATUS.PENDING,
    //     product: inventoryItem.product.id,
    //     priceSnapshot: inventoryItem.product.price,
    //     productNameSnapshot: inventoryItem.product.name,
    //     quantity: inventoryItem.quantity,
    //     cashback_rate: inventoryItem.product.cashback_rate,
    //     cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
    //   };

    //   const orderProduct = await createOrderProduct({
    //     dto: createOrderProductDto,
    //   });

    //   // 히스토리 생성
    //   const createRecentPurchasedHistoryDto: CreateRecentPurchasedHistoryDto = {
    //     user: userId,
    //     product: inventoryItem.product.id,
    //     quantity: inventoryItem.quantity,
    //     amount: inventoryItem.product.price,
    //   };
    //   await createRecentPurchasedHistory(createRecentPurchasedHistoryDto);

    //   // 사용 포인트 차감
    //   if (usedPoint) {
    //     await createUsePointTransaction({
    //       userId,
    //       orderProductId: orderProduct.id,
    //       amount: pointAllocator.getAllocatedPoint(inventoryItem.product.id),
    //     });
    //   }
    // }

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
