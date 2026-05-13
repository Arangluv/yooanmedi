'use server';

import { OrderProduct } from '@/entities/order-product';
import { User } from '@/entities/user';
import { getPayload } from '@/shared/infrastructure';
import { PaymentsMethod } from '@/entities/order/constants/payments-method';
import { OrderStatus } from '@/entities/order/constants/order-status';

// 해당 부분 수정
type ExcelExportRowData = {
  id: number;
  user: number | User;
  orderProducts?:
    | {
        docs?: (number | OrderProduct)[];
        hasNextPage?: boolean;
        totalDocs?: number;
      }
    | undefined;
  paymentsMethod: PaymentsMethod;
  orderNo: string;
  finalPrice: number;
  createdAt: string;
};

export type ExcelExportDto = {
  index: number;
  orderNo: string;
  orderDate: string;
  orderUser: string;
  manufacturer: string;
  productName: string;
  insuranceCode: string;
  price: number;
  quantity: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentsMethod: PaymentsMethod;
};

export const getExcelExportData = async () => {
  const payload = await getPayload();

  const data = await payload.find({
    collection: 'order',
    select: {
      finalPrice: true,
      orderNo: true,
      user: true,
      orderProducts: true,
      createdAt: true,
      paymentsMethod: true,
    },
    populate: {
      'order-product': {
        productNameSnapshot: true,
        priceSnapshot: true,
        quantity: true,
        productDeliveryFee: true,
        orderProductStatus: true,
        product: true,
      },
      users: {
        hospitalName: true,
      },
      product: {
        manufacturer: true,
        insurance_code: true,
        image: true,
      },
    },
  });

  return normalizeData(data.docs as ExcelExportRowData[]);
};

const normalizeData = (data: ExcelExportRowData[]) => {
  const exportData: ExcelExportDto[] = [];
  let indexCount = 1;

  data.forEach((item) => {
    item.orderProducts?.docs?.forEach((orderProduct) => {
      if (typeof orderProduct === 'number' || typeof orderProduct.product === 'number') {
        throw new Error('잘못된 데이터 형식입니다.');
      }

      if (typeof item.user === 'number') {
        throw new Error('잘못된 데이터 형식입니다.');
      }

      const user = item.user;
      const product = orderProduct.product;

      exportData.push({
        index: indexCount,
        orderNo: item.orderNo,
        orderDate: item.createdAt,
        orderUser: user.hospitalName ?? '',
        manufacturer: (product as any)?.manufacturer,
        productName: orderProduct.productNameSnapshot,
        insuranceCode: (product as any)?.insurance_code ?? '',
        price: orderProduct.priceSnapshot,
        quantity: orderProduct.quantity,
        totalPrice: orderProduct.priceSnapshot * orderProduct.quantity,
        orderStatus: orderProduct.orderProductStatus,
        paymentsMethod: item.paymentsMethod,
      });
      indexCount++;
    });
  });

  return exportData;
};
