interface EndPointSuccessResult {
  isSuccess: true;
  message: string;
}

interface EndPointSuccessResultWithDataResult<TData> {
  isSuccess: true;
  message: string;
  data: TData;
}

interface EndPointFailureResult {
  isSuccess: false;
  message: string;
}

export type EndPointResult<TData = void> =
  | EndPointFailureResult
  | (TData extends void ? EndPointSuccessResult : EndPointSuccessResultWithDataResult<TData>);

export const ok = (message: string = 'ok'): EndPointSuccessResult => ({
  isSuccess: true,
  message,
});

export const okWithData = <TData>({
  message = 'ok',
  data,
}: {
  message?: string;
  data: TData;
}): EndPointSuccessResultWithDataResult<TData> => ({
  isSuccess: true,
  message,
  data: data,
});

export const failure = (message: string): EndPointFailureResult => ({
  isSuccess: false,
  message,
});
