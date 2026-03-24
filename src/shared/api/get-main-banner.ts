'use server';

export const getMainBanners = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/globals/banner`, {
    cache: 'no-store',
  });
  const data = await res.json();

  return data.items;
};
