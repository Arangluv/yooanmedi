import { describe, it } from 'vitest';
import { getPayload } from '@/shared/infrastructure';

describe('tasd', () => {
  it('가져오자', async () => {
    const payload = await getPayload();
    const user = await payload.find({
      collection: 'users',
      where: {
        isApproved: {
          equals: false,
        },
      },
      depth: 0,
    });

    console.log('user');
    console.log(user);
  });
});
