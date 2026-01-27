'use server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { cookies } from 'next/headers';
import { MetaSettingType, ProductItemType } from './_type';

export async function getAuthUser() {
  const payload = await getPayload({ config: config });
  const { user } = await payload.auth({
    headers: new Headers({ cookie: (await cookies()).toString() }),
  });

  // 로그인하지 않았다면 user === null;
  if (!user) {
    return {
      user: null,
      message: '로그인 후 이용할 수 있습니다',
    };
  }

  const dto = {
    id: user.id,
    role: user.role,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    isApproved: user.isApproved,
    username: user.username,
    hospitalName: user.hospitalName ? user.hospitalName : '관리자',
    point: user.point,
  };

  // 관리자면 로그인
  if (dto.role === 'admin') {
    return {
      user: dto,
      message: 'success',
    };
  }

  // 회원가입 승인여부 검사
  if (!dto.isApproved) {
    return {
      user: null,
      message: '아직 회원가입이 승인되지 않았습니다',
    };
  }

  return {
    user: dto,
    message: 'success',
  };
}

export async function getMinOrderPrice() {
  const payload = await getPayload({ config: config });
  try {
    const metaSetting = (await payload.findGlobal({
      slug: 'meta-setting',
      select: {
        min_order_price: true,
      },
    })) as MetaSettingType;

    return metaSetting.min_order_price;
  } catch (error) {
    return 0;
  }
}

export async function getProductsCategory() {
  try {
    const payload = await getPayload({ config: config });
    const productsCategory = await payload.find({
      collection: 'product-category',
      select: {
        name: true,
      },
      sort: 'createdAt',
    });

    return productsCategory.docs;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBestProducts() {
  try {
    const payload = await getPayload({ config: config });
    const bestProducts = await payload.find({
      collection: 'product',
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        cashback_rate: true,
        cashback_rate_for_bank: true,
        manufacturer: true,
        specification: true,
        insurance_code: true,
        stock: true,
        delivery_fee: true,
        returnable: true,
        is_cost_per_unit: true,
        is_free_delivery: true,
      },
      where: {
        is_best_product: {
          equals: true,
        },
        stock: {
          greater_than: 0,
        },
      },
      limit: 12,
    });

    return bestProducts.docs as unknown as ProductItemType[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCurrentUserOrderHistory({
  prod_id,
  user_id,
}: {
  prod_id: number;
  user_id: number;
}) {
  const payload = await getPayload({ config: config });
  const orderHistory = await payload.find({
    collection: 'order',
    where: {
      user: {
        equals: user_id,
      },
      product: {
        equals: prod_id,
      },
    },
    select: {
      id: true,
      orderCreatedAt: true,
      quantity: true,
      product: true,
    },
    populate: {
      product: {
        price: true,
      },
    },
    limit: 3,
  });

  return orderHistory.docs;
}
