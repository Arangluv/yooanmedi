'use server';

import { zodSafeParse } from '@/shared/lib/zod';
import { DeliveryFeeManager } from '@/entities/inventory/lib/delivery-fee-manager';
import { PointAllocator } from '@/entities/point/lib/use/point-allocator';
import {
  enrichedOrderListSchema,
  populatedOrderListSchema,
  type EnrichedOrderList,
  type PopulatedOrderList,
} from './schema/payment-order-list.schema';
import { type Product } from '@/entities/product/model/schemas/product.schema';
import { ProductRepository } from '@/entities/product/api/repository';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';
import { PaymentRequestDto } from './schema/payments-request.schema';

interface ClinentOrderList {
  product: Pick<Product, 'id' | 'price'>;
  quantity: number;
}

/**
 * @description 주문 리스트를 결제에서 사용할 데이터를 추가한 후 반환합니다
 */
export const enrichedOrderListFromContext = async (
  requestDto: PaymentRequestDto,
): Promise<EnrichedOrderList> => {
  const orderList = await populateProductDetails(requestDto.orderList);
  const deliveryFeeManager = new DeliveryFeeManager(orderList, requestDto.minOrderPrice);
  const pointAllocator = new PointAllocator(deliveryFeeManager, requestDto.usedPoint);

  const enrichedOrderList = orderList.map((orderProduct) => {
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

const populateProductDetails = async (
  orderList: ClinentOrderList[],
): Promise<PopulatedOrderList> => {
  const productIds = orderList.map((item) => item.product.id);
  const products = await ProductRepository.findAll(productIds);

  const populatedOrderList = orderList.map((item) => {
    const product = products.find((product) => product.id === item.product.id);
    if (!product) {
      const error = new BusinessLogicError(`결제를 처리하는 도중 문제가 발생했습니다`);
      error.setDevMessage(`상품 정보를 찾을 수 없습니다. 상품 ID: ${item.product.id}`);
      throw error;
    }

    return {
      product: {
        ...product,
        price: item.product.price, // 매우 중요한 로직이다. 사용자에게 설정된 가격으로 결제되어야한다.
      },
      quantity: item.quantity,
    };
  });

  return zodSafeParse(populatedOrderListSchema, populatedOrderList);
};
