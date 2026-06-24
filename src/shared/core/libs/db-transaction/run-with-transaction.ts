export interface TransactionalCommand<TResult> {
  run(): Promise<TResult>;
  onRollback?(): Promise<void>;
}
