export interface TransactionalCommand<T> {
  run(): Promise<T>;
  onRollback?(): Promise<void>;
}
