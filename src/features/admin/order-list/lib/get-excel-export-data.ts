'use server';

import { OrderProduct } from '@/entities/order-product/model/types';
import { User } from '@/entities/user';
import { getPayload } from '@/shared/infrastructure';
import { PaymentsMethod } from '@/entities/order/constants/payments-options';
import { OrderStatus } from '@/entities/order/constants/order-status';

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

  return normalizeData(data.docs);
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
        manufacturer: product?.manufacturer,
        productName: orderProduct.productNameSnapshot,
        insuranceCode: product?.insurance_code ?? '',
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
// {
//   "id": 279,
//   "user": {
//       "id": 3,
//       "hospitalName": "인천병원"
//   },
//   "orderProducts": {
//       "docs": [
//           {
//               "id": 98,
//               "product": {
//                   "id": 1685,
//                   "image": null,
//                   "insurance_code": "074200080",
//                   "manufacturer": "오펠라헬스케어코리아주식회사"
//               },
//               "orderProductStatus": "cancelled",
//               "productNameSnapshot": "둘코락스좌약",
//               "priceSnapshot": 1000,
//               "productDeliveryFee": 0,
//               "quantity": 1
//           },
//           {
//               "id": 97,
//               "product": {
//                   "id": 1684,
//                   "image": null,
//                   "insurance_code": "641100270",
//                   "manufacturer": "바이엘코리아"
//               },
//               "orderProductStatus": "cancelled",
//               "productNameSnapshot": "아스피린프로텍트정100mg",
//               "priceSnapshot": 2000,
//               "productDeliveryFee": 0,
//               "quantity": 1
//           },
//           {
//               "id": 96,
//               "product": {
//                   "id": 1683,
//                   "image": null,
//                   "insurance_code": "649801890",
//                   "manufacturer": "(사용X)명문제약"
//               },
//               "orderProductStatus": "cancelled",
//               "productNameSnapshot": "부로멜라장용정",
//               "priceSnapshot": 5000,
//               "productDeliveryFee": 0,
//               "quantity": 1
//           }
//       ],
//       "hasNextPage": false
//   },
//   "paymentsMethod": "bankTransfer",
//   "orderNo": "202602261809013",
//   "finalPrice": 8000,
//   "createdAt": "2026-02-26T12:25:48.990Z"
// }
