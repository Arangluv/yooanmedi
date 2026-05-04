import { describe, it, expect } from 'vitest';
import { getPayload } from '@/shared/infrastructure';

describe('orderSchema', () => {
  it('order 스키마 테스트를 진행해주세요', async () => {
    const payload = await getPayload();
    const { docs } = await payload.find({
      collection: 'order',
      populate: {
        users: {},
      },
    });
    // console.log('docs[0]');
    // console.log(JSON.stringify(docs[0], null, 2));
    const order = await payload.findByID({
      collection: 'order',
      id: 644,
    });
    console.log(JSON.stringify(order, null, 2));
  });
});
