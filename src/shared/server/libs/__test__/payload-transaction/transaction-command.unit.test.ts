import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionCommand } from '../../payload-transaction';

describe('TransactionCommand', () => {
  const TEST_TX_ID = 'test-tx-id';
  const payload = {
    db: {
      beginTransaction: vi.fn().mockResolvedValue(TEST_TX_ID),
      commitTransaction: vi.fn().mockResolvedValue(undefined),
      rollbackTransaction: vi.fn().mockResolvedValue(undefined),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('성공 시 commitTransaction 호출한다', async () => {
    class TestCommand extends TransactionCommand<string> {
      protected async run(): Promise<string> {
        return 'success';
      }
    }

    // given
    const command = new TestCommand(payload as any);
    // when
    const result = await command.execute();
    // then
    expect(result).toBe('success');
    expect(payload.db.beginTransaction).toHaveBeenCalled();
    expect(payload.db.commitTransaction).toHaveBeenCalledWith(TEST_TX_ID);
    expect(payload.db.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('실패 시 rollbackTransaction 호출한다', async () => {
    class TestCommand extends TransactionCommand<void> {
      protected async run(): Promise<void> {
        throw new Error('fail');
      }
    }

    // given
    const command = new TestCommand(payload as any);

    // then
    await expect(command.execute()).rejects.toThrow('fail');
    expect(payload.db.beginTransaction).toHaveBeenCalled();
    expect(payload.db.commitTransaction).not.toHaveBeenCalled();
    expect(payload.db.rollbackTransaction).toHaveBeenCalledWith(TEST_TX_ID);
  });

  it('구현체에서 TransactionCommand의 run()을 구현하지 않으면 error를 throw한다', async () => {
    class TestCommand extends TransactionCommand<void> {}

    const command = new TestCommand(payload as any);

    await expect(command.execute).rejects.toThrow();
  });
});
