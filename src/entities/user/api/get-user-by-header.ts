'use server';

import { getPayload } from '@shared/lib/get-payload';
import { headers as nextHeaders } from 'next/headers';
import type { User } from '../model/user';

export const getUserByHeader = async (): Promise<User | null> => {
  const nextHeader = await nextHeaders();
  const payload = await getPayload();

  const payloadAuthResult = await payload.auth({
    headers: nextHeader,
    canSetHeaders: false,
  });

  if (!payloadAuthResult.user) {
    return null;
  }

  return payloadAuthResult.user;
};
