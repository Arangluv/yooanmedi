'use server';

import { getPayload } from '@/shared/server';

export async function findIdToResetPasswordApi(dto: {
  username: string;
  hospitalName: string;
  nursingNumber: string;
}) {
  try {
    const payload = await getPayload();
    const { username, hospitalName, nursingNumber } = dto;
    const user = await payload.find({
      collection: 'users',
      select: {
        username: true,
      },
      where: {
        username: {
          equals: username,
        },
        hospitalName: {
          equals: hospitalName,
        },

        nursingNumber: {
          equals: nursingNumber,
        },
      },
    });
    const userData = user.docs;
    if (userData.length === 0) {
      return { success: false, message: '아이디가 존재하지 않거나, 일치하지 않은 정보입니다.' };
    }

    return { success: true, message: '', username: userData[0].username };
  } catch (error) {
    return {
      success: false,
      message: '아이디 찾기 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}

export async function resetPasswordApi(dto: { username: string; password: string }) {
  try {
    const payload = await getPayload();
    const { username, password } = dto;
    const user = await payload.update({
      collection: 'users',
      data: {
        password: password,
      },
      where: {
        username: {
          equals: username,
        },
      },
    });

    return { success: true, message: '', username: user.docs[0].username };
  } catch (error) {
    return {
      success: false,
      message: '비밀번호 재설정 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
