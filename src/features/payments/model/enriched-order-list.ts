'use server';

import { getProductById } from '@/entities/product';
import type { InventoryItem } from '@/entities/inventory/model/type';
import { inventorySchema } from '@/entities/inventory/model/inventory-schema';
import { zodSafeParse } from '@/shared/lib/zod';
import { DeliveryFeeManager } from '@/entities/inventory/lib/delivery-fee-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import type { BasePaymentContext } from './schema/payment-context-schema';
import {
  EnrichedOrderList,
  enrichedOrderListSchema,
  HydratedOrderList,
} from './schema/order-list.schema';

interface OrderList {
  product: Pick<InventoryItem['product'], 'id' | 'price'>;
  quantity: InventoryItem['quantity'];
}

/**
 * @description 주문 리스트를 결제에서 사용할 데이터를 추가한 후 반환합니다
 */
export const enrichedOrderListFromContext = async (
  context: BasePaymentContext,
): Promise<EnrichedOrderList> => {
  const rawToHydratedOrderList = await hydratedOrderList(context.orderList);
  const deliveryFeeManager = new DeliveryFeeManager(rawToHydratedOrderList, context.minOrderPrice);
  const pointAllocator = new PointAllocator(deliveryFeeManager, context.usedPoint);

  const enrichedOrderList = rawToHydratedOrderList.map((orderProduct) => {
    const totalAmount =
      deliveryFeeManager.getOrderProductSubtotal(orderProduct) -
      pointAllocator.getAllocatedPoint(orderProduct.product.id);
    const orderProductDeliveryFee = deliveryFeeManager.getOrderProductDeliveryFee(orderProduct);
    const calculatedUsedPoint = pointAllocator.getAllocatedPoint(orderProduct.product.id);

    return {
      ...orderProduct,
      totalAmount,
      orderProductDeliveryFee,
      calculatedUsedPoint,
    };
  });

  return zodSafeParse(enrichedOrderListSchema, enrichedOrderList);
};

const hydratedOrderList = async (orderList: OrderList[]): Promise<HydratedOrderList> => {
  const rawInventory = await Promise.all(
    orderList.map(async (item) => {
      const product = await getProductById(item.product.id);

      return {
        product: {
          ...product,
          price: item.product.price,
        },
        quantity: item.quantity,
      };
    }),
  );

  const transformedInventory = zodSafeParse(inventorySchema, rawInventory);
  return transformedInventory;
};
