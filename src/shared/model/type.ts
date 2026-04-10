import type { MetaSetting as PayloadMetaSetting } from '@/payload-types';

export type MetaSetting = PayloadMetaSetting;

interface BaseUsecaseResult {
  message: string;
}

interface UsecaseResultWithData<TData> extends BaseUsecaseResult {
  data: TData;
}

export type UsecaseResult<TData = never> = [TData] extends [never]
  ? BaseUsecaseResult
  : UsecaseResultWithData<TData>;
