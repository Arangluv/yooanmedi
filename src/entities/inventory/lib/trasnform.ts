'use server';

import { getProductById } from '@/entities/product';

import type { InventoryItem } from '../model/type';

interface OrderList {
  product: Pick<InventoryItem['product'], 'id' | 'price'>;
  quantity: InventoryItem['quantity'];
}

/**
 * @description 주문 리스트를 invenroty entity로 변환합니다.
 */
export const transformOrderListToInventory = async (orderList: OrderList[]) => {
  const transformedInventory = await Promise.all(
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

  return transformedInventory;
};
