export class Logger {
  public static error(message: string, code?: string): void {
    console.log('--------------------------------');
    console.log('[Logger] - Message');
    console.log(message);
    console.log('[Logger] - Code');
    console.log(code);
    console.log('--------------------------------');
  }
}
