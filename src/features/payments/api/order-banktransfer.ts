'use server';

import { transformOrderListToInventory } from '@/entities/inventory';
import { createUsePointTransaction, getUsedPointListCalculatedWeight } from '@/entities/point';
import { getDeliveryFeeFromProductCosiderFlg } from '@/entities/price';
import { createOrder, CreateOrderDto, ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';

import { type OrderBankTransferDto } from '../model/order-banktransfer-schema';
import { getNowISOString } from '@/shared';

export const orderBankTransfer = async (dto: OrderBankTransferDto) => {
  try {
    const { shopOrderNo, deliveryRequest, orderList, usedPoint, userId, minOrderPrice } = dto;

    const inventory = await transformOrderListToInventory(orderList);
    const totalPriceWithoutDeliveryFee = inventory.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
    const freeDeliveryFlg = totalPriceWithoutDeliveryFee >= minOrderPrice;
    const pointList = getUsedPointListCalculatedWeight({ inventory, usedPoint });

    for (let i = 0; i < inventory.length; i++) {
      const inventoryItem = inventory[i];
      const productDeliveryFee = getDeliveryFeeFromProductCosiderFlg({
        inventoryItem,
        freeDeliveryFlg,
      });

      const orderDto = {
        user: userId,
        product: inventoryItem.product.id,
        quantity: inventoryItem.quantity,
        price: inventoryItem.product.price,
        cashback_rate: inventoryItem.product.cashback_rate,
        cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
        delivery_fee: productDeliveryFee,
        orderNo: shopOrderNo,
        paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
        orderCreatedAt: getNowISOString(),
        orderStatus: ORDER_STATUS.PENDING,
        orderRequest: deliveryRequest,
      } as CreateOrderDto;

      const order = await createOrder({
        dto: orderDto,
      });

      if (usedPoint) {
        await createUsePointTransaction({
          userId,
          orderId: order.id,
          amount: pointList[i],
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
