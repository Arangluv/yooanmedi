'use server';

import { headers as nextHeaders } from 'next/headers';
import { getPayload } from '@shared/infrastructure';

export const getUserByHeader = async () => {
  const nextHeader = await nextHeaders();
  const payload = await getPayload();

  const { user } = await payload.auth({
    headers: nextHeader,
    canSetHeaders: false,
  });

  return user;
};
