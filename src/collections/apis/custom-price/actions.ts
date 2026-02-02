'use server';

import { SelectedProduct } from '@/app/(payload)/context/useProductSelectStore';
import { getPayload } from 'payload';
import config from '@payload-config';
import { TargetUser } from '@/app/(payload)/context/useUserInfo';

export const createCustomPrice = async ({
  products,
  user,
}: {
  products: SelectedProduct[];
  user: TargetUser;
}) => {
  const payload = await getPayload({ config: config });
  try {
    await Promise.all(
      products.map(async (product) => {
        const existingProductPrice = await payload.find({
          collection: 'product-price',
          where: {
            product: {
              equals: product.id,
            },
            user: {
              equals: user.id,
            },
          },
        });

        if (existingProductPrice.docs.length > 0) {
          await payload.update({
            collection: 'product-price',
            id: existingProductPrice.docs[0].id,
            data: {
              price: product.custom_price,
            },
          });
        } else {
          await payload.create({
            collection: 'product-price',
            data: {
              product: product.id,
              user: user.id,
              price: product.custom_price,
            },
          });
        }
      }),
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, message: '고객별 가격을 생성하는데 문제가 발생했습니다' };
  }
};
