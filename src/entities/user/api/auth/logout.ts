'use server';

import { logout as payloadLogout } from '@payloadcms/next/auth';
import config from '@/payload.config';

export const logout = async () => {
  try {
    const res = await payloadLogout({ config, allSessions: true });

    if (res.success) {
      return { success: true };
    } else {
      return { success: false, message: '로그아웃하는데 문제가 발생했습니다' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: '로그아웃을 하는데 문제가 발생했습니다' };
  }
};
