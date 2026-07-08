interface EndPointSuccessResult {
  isSuccess: true;
  message: string;
}

interface EndPointSuccessResultWithData<TData> {
  isSuccess: true;
  message: string;
  data: TData;
}

interface EndPointFailureResult<TErrorData = unknown> {
  isSuccess: false;
  message: string;
  data?: TErrorData;
}

export type EndPointResult<TData = void, TErrorData = unknown> =
  | (TData extends void ? EndPointSuccessResult : EndPointSuccessResultWithData<TData>)
  | EndPointFailureResult<TErrorData>;

// TODO :: will remove
export const ok = (message: string = 'ok'): EndPointSuccessResult => ({
  isSuccess: true,
  message,
});

// TODO :: will remove
export const okWithData = <TData>({
  message = 'ok',
  data,
}: {
  message?: string;
  data: TData;
}): EndPointSuccessResultWithData<TData> => ({
  isSuccess: true,
  message,
  data,
});

// TODO :: will remove
export const failure = (message: string): EndPointFailureResult => ({
  isSuccess: false,
  message,
});

export class EndPointResultManager {
  static ok(message: string = 'ok'): EndPointSuccessResult {
    return {
      isSuccess: true,
      message,
    };
  }

  static okWithData<TData>({
    message = 'ok',
    data,
  }: {
    message?: string;
    data: TData;
  }): EndPointSuccessResultWithData<TData> {
    return {
      isSuccess: true,
      message,
      data,
    };
  }

  static fail(message: string): EndPointFailureResult {
    return {
      isSuccess: false,
      message,
    };
  }
}
