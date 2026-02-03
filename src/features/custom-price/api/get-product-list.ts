'use server';

/** entities */
import { getProductList } from '@/entities/product/api/get-product-list';
import { getUserByHeader } from '@/entities/user/api/get-user-by-header';
import type { SearchParamsType } from '@/entities/product/model/types';
import type { User } from '@/entities/user/model/user';

/** shared */
import { getPayload } from '@shared/lib/get-payload';

import { convertToCustomPrice } from '../lib/convert-to-custom-price';
import type { CustomPriceTable } from '../model/custom-price-table';

const getCustomPrice = async (user: User): Promise<CustomPriceTable[]> => {
  const payload = await getPayload();
  const data = await payload.find({
    collection: 'product-price',
    select: {
      price: true,
      product: true,
    },
    where: {
      user: {
        equals: user.id,
      },
    },
    populate: {
      // 빈 객체 전달 시 id만 전달됨
      product: {},
    },
  });

  return data.docs as CustomPriceTable[];
};

export const getCustomPriceList = async (searchParams: SearchParamsType) => {
  const { productList, totalProductPages, totalProductDocs } = await getProductList(searchParams);

  const user = await getUserByHeader();

  // TODO : Error Handling
  if (!user) {
    throw new Error('User not found');
  }

  const customPriceTable = await getCustomPrice(user as User);
  const convertedProductList = convertToCustomPrice(productList, customPriceTable);

  return { productList: convertedProductList, totalProductPages, totalProductDocs };
};
