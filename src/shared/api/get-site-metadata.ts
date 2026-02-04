'use server';

import { getPayload } from '../lib/get-payload';

export type SiteMetadata = {
  minOrderPrice: number;
};

export const getSiteMetadata = async (): Promise<SiteMetadata> => {
  const payload = await getPayload();

  try {
    const metaSetting = await payload.findGlobal({
      slug: 'meta-setting',
      select: {
        min_order_price: true,
      },
    });

    if (!metaSetting || !metaSetting.min_order_price) {
      return {
        minOrderPrice: 0,
      };
    }

    return {
      minOrderPrice: metaSetting.min_order_price,
    };
  } catch (error) {
    return {
      minOrderPrice: 0,
    };
  }
};
