'use server';

import { convertToCustomPrice } from '../lib/convert-to-custom-price';
import type { CustomPriceTable } from '../model/custom-price-table';

/** entities */
import { getUserByHeader } from '@/entities/user';
import { getProductList } from '@/entities/product';
import type { ProductSearchParamsType } from '@/entities/product';
import type { User } from '@/entities/user';

/** shared */
import { getPayload } from '@shared/lib/get-payload';
import { getProductRankingList } from '@/entities/product/api/get-product-list';

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

export const getCustomPriceList = async (searchParams: ProductSearchParamsType) => {
  try {
    const { productList, totalProductPages, totalProductDocs } = await getProductList(searchParams);

    const user = await getUserByHeader();

    // TODO : Error Handling
    if (!user) {
      throw new Error('User not found');
    }

    const customPriceTable = await getCustomPrice(user as User);
    const convertedProductList = convertToCustomPrice(productList, customPriceTable);

    return { productList: convertedProductList, totalProductPages, totalProductDocs };
  } catch (error) {
    console.error(error);
    return { productList: [], totalProductPages: 0, totalProductDocs: 0 };
  }
};

export const getProductListConvertedToCustomPrice = async () => {
  try {
    // 3초대기하는 테스트
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { productList } = await getProductRankingList();
    const user = await getUserByHeader();

    // TODO : Error Handling
    if (!user) {
      throw new Error('User not found');
    }

    const customPriceTable = await getCustomPrice(user as User);
    const convertedProductList = convertToCustomPrice(productList, customPriceTable);

    return convertedProductList;
  } catch (error) {
    console.error(error);
    return [];
  }
};
