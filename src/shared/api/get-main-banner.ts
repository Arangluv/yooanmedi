'use server';

import { getPayload } from '../lib/get-payload';

export const getMainBanners = async () => {
  const payload = await getPayload();

  const banner = await payload.findGlobal({
    slug: 'banner',
    select: {
      items: true,
    },
  });

  return banner.items;
};
