import { BasePayload } from 'payload';
import { BaseError } from '@/shared/core';
import { TransactionContext, transactionStorage } from './transaction-context';

type TransactionId = string | number;

export abstract class TransactionCommand<TResult> {
  protected readonly payload: BasePayload;

  public constructor(payload: BasePayload) {
    this.payload = payload;
  }

  public async execute() {
    const txId = await this.getTransactionId();

    try {
      const req = { transactionID: txId } as TransactionContext['req'];
      const result = await transactionStorage.run({ req }, () => this.run());
      await this.commitTransaction(txId);
      return result;
    } catch (error) {
      await this.rollbackTransaction(txId);
      await this.onRollback();
      throw error;
    }
  }

  protected async run(): Promise<TResult> {
    const error = new BaseError({
      clientMsg: '요청을 처리하는데 문제가 발생했습니다',
      devMsg: '구현체에서 run()을 구현해야합니다',
      errorName: 'TransactionCommandError',
    });
    throw error;
  }

  protected async onRollback(): Promise<void> {}

  private async getTransactionId(): Promise<TransactionId> {
    const txId = await this.payload.db.beginTransaction();
    if (!txId) {
      const error = {
        clientMsg: '요청을 처리하는데 문제가 발생했습니다',
        devMsg: 'payload transaction ID가 누락되었습니다',
        errorName: 'TransactionCommandError',
      };
      throw error;
    }

    return txId;
  }

  private async commitTransaction(transactionId: TransactionId) {
    await this.payload.db.commitTransaction(transactionId);
  }

  private async rollbackTransaction(transactionId: TransactionId) {
    await this.payload.db.rollbackTransaction(transactionId);
  }
}
