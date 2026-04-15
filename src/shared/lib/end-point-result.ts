interface EndPointFailureResult {
  isSuccess: false;
  message: string;
}

interface EndPointSuccessWithData<TData> {
  isSuccess: true;
  message: string;
  data: TData;
}

interface EndPointSuccessWithoutData {
  isSuccess: true;
  message: string;
}

export type EndPointResult<TData = void> =
  | EndPointFailureResult
  | (TData extends void ? EndPointSuccessWithoutData : EndPointSuccessWithData<TData>);

export const ok = <TData>(data: TData, message: string = 'ok'): EndPointSuccessWithData<TData> => ({
  isSuccess: true,
  message,
  data,
});

export const okWithoutData = (message: string = 'ok'): EndPointSuccessWithoutData => ({
  isSuccess: true,
  message,
});

export const failure = (message: string): EndPointFailureResult => ({
  isSuccess: false,
  message,
});
