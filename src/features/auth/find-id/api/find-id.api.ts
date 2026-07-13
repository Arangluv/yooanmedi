'use server';

import { getPayload } from '@/shared/server';

export const findIdApi = async (dto: {
  hospitalName: string;
  businessNumber: string;
  nursingNumber: string;
  phoneNumber: string;
}) => {
  try {
    const payload = await getPayload();
    const { hospitalName, businessNumber, nursingNumber, phoneNumber } = dto;
    const user = await payload.find({
      collection: 'users',
      select: {
        username: true,
      },
      where: {
        hospitalName: {
          equals: hospitalName,
        },
        businessNumber: {
          equals: businessNumber,
        },
        nursingNumber: {
          equals: nursingNumber,
        },
        phoneNumber: {
          equals: phoneNumber,
        },
      },
    });
    const userData = user.docs;
    if (userData.length === 0) {
      return { success: false, message: '가입 이력이 없는 아이디입니다' };
    }

    return { success: true, message: '', username: userData[0].username };
  } catch (error) {
    return {
      success: false,
      message: '아이디 찾기 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
};
