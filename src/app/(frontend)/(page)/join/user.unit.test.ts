import { getPayload } from '@/shared/infrastructure';
import { describe, it } from 'vitest';

describe('asd', () => {
  it('user', async () => {
    const payload = await getPayload();
    const user1 = await payload.update({
      collection: 'users',
      id: 32,
      data: {
        faxNumber: '',
        email: 'onewood@naver.com',
      },
    });

    const user2 = await payload.update({
      collection: 'users',
      id: 29,
      data: {
        faxNumber: '',
        doctorLicenseNumber: '',
        email: 'asd@naver.com',
      },
    });
  });
});
