export interface BaseErrorOptions {
  clientMsg: string;
  devMsg?: string;
  errorName: string;
}

export class BaseError extends Error {
  protected devMsg?: string;

  constructor(options: BaseErrorOptions) {
    super(options.clientMsg);
    this.devMsg = options.devMsg;
    this.name = options.errorName;
  }

  static validationError({ clientMsg, devMsg }: { clientMsg: string; devMsg?: string }): BaseError {
    return new BaseError({ clientMsg, devMsg, errorName: 'ValidationError' });
  }

  public getClientMessage(): string {
    return this.message;
  }

  public getDevMessage(): string {
    return this.devMsg ?? '';
  }
}

export class BaseErrorManager {
  static resolveClientMessage(error: unknown): string | null {
    if (error instanceof BaseError) {
      return error.getClientMessage();
    }

    return null;
  }
}
