export interface BaseErrorOptions<TData = unknown> {
  clientMsg: string;
  devMsg?: string;
  errorName: string;
  data?: TData | null;
}

export class BaseError<TData = unknown> extends Error {
  protected devMsg?: string;
  protected data?: TData | null;

  constructor(options: BaseErrorOptions<TData>) {
    super(options.clientMsg);
    this.devMsg = options.devMsg;
    this.name = options.errorName;
    this.data = options?.data ?? null;
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

  public getErrorData(): TData | null {
    return this.data ?? null;
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
