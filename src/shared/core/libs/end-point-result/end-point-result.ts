interface EndPointSuccessResult {
  isSuccess: true;
  message: string;
}

interface EndPointSuccessResultWithData<TData> {
  isSuccess: true;
  message: string;
  data: TData;
}

interface EndPointFailureResult {
  isSuccess: false;
  message: string;
}

export type EndPointResult<TData = void> =
  | (TData extends void ? EndPointSuccessResult : EndPointSuccessResultWithData<TData>)
  | EndPointFailureResult;

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
}): EndPointSuccessResultWithData<TData> => ({
  isSuccess: true,
  message,
  data,
});

export const failure = (message: string): EndPointFailureResult => ({
  isSuccess: false,
  message,
});


