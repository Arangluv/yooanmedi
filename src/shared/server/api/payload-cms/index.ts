import payload from 'payload';
import { payloadConfig } from '../../configs';

export class PayloadCms {
  public static async getInstance() {
    await payload.init({
      config: payloadConfig,
    });
    return payload;
  }

  public static async getInstanceAndTransactionId() {
    await payload.init({ config: payloadConfig });
    const transactionID = await payload.db.beginTransaction();
    return { payload, transactionID };
  }
}
