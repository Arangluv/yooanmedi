export interface IPaymentsCommand<TResult> {
  execute(): Promise<TResult>;
}
