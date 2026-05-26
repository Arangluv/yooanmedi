import payload from 'payload';
import { payloadConfig } from '../../configs';

export class PayloadCms {
  public static async getInstance() {
    await payload.init({
      config: payloadConfig,
    });
    return payload;
  }
}
