import payload from 'payload';
import { payloadConfig } from '../../configs';

export const getPayload = async () => {
  return await payload.init({
    config: payloadConfig,
  });
};

// 아래같이 작성하면 싱글톤 객체가 안됨
export class PayloadCms {
  public static async getInstance() {
    await payload.init({
      config: payloadConfig,
    });
    return payload;
  }
}
