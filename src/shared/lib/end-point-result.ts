interface EndPointBaseResult {
  isSuccess: boolean;
  message: string;
}

interface EndPointSuccessResultWithDataResult<TData> {
  isSuccess: true;
  message: string;
  data: TData;
}

export type EndPointResult<TData = void> =
  | EndPointBaseResult
  | (TData extends void ? EndPointBaseResult : EndPointSuccessResultWithDataResult<TData>);

export const ok = (message: string = 'ok'): EndPointBaseResult => ({
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

export const failure = (message: string): EndPointBaseResult => ({
  isSuccess: false,
  message,
});
