import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runWithTransaction, TransactionalCommand } from './run-with-transaction';
import { getPayload } from './get-payload';
import { SystemError } from '../model/errors/domain.error';
import { commitTransaction } from 'payload';

vi.mock('./get-payload', () => ({
  getPayload: vi.fn(),
}));

describe('runWithTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('transactionID가 없으면 SystemError를 throw한다', async () => {
    vi.mocked(getPayload as any).mockResolvedValue({
      db: {
        beginTransaction: vi.fn().mockResolvedValue(null),
      },
    });

    const command: TransactionalCommand<void> = {
      run: async () => {
        await Promise.resolve();
      },
    };

    await expect(() => runWithTransaction(command)).rejects.toThrow(SystemError);
  });

  it.each([
    [
      {
        caseName: 'run이 Promise를 반환하는 경우',
        caseResult: '값을 반환한다',
        runResult: Promise.resolve('literal'),
        expected: 'literal',
      },
    ],
    [
      {
        caseName: 'run이 값을 반환하는 경우',
        caseResult: '값을 반환한다',
        runResult: 'literal',
        expected: 'literal',
      },
    ],
  ])('$caseName -> $caseResult', async ({ runResult, expected }) => {
    vi.mocked(getPayload as any).mockResolvedValue({
      db: {
        beginTransaction: vi.fn().mockResolvedValue('test-transaction-id'),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    });

    const command: TransactionalCommand<typeof runResult> = {
      run: async () => runResult,
    };

    const result = await runWithTransaction(command);
    expect(result).toEqual(expected);
  });

  it.each([
    {
      caseName: 'run에서 Error가 throw되면',
      caseResult: 'commitTransaction이 실행되지 않는다',
      runFn: async () => {
        throw new Error('Command run Error');
      },
      expectCommit: false,
    },
    {
      caseName: 'run이 Promise reject를 반환하면',
      caseResult: 'commitTransaction이 실행되지 않는다',
      runFn: async () => {
        return Promise.reject('reject promise');
      },
      expectCommit: false,
    },
    {
      caseName: 'run이 값을 반환하면',
      caseResult: 'commitTransaction이 실행된다',
      runFn: async () => 'test',
      expectCommit: true,
    },
  ])('$caseName -> $caseResult', async ({ runFn, expectCommit }) => {
    const commitTransaction = vi.fn();
    const rollbackTransaction = vi.fn();

    vi.mocked(getPayload as any).mockResolvedValue({
      db: {
        beginTransaction: vi.fn().mockResolvedValue('tx-id'),
        commitTransaction,
        rollbackTransaction,
      },
    });

    const command = {
      run: runFn,
    };

    if (expectCommit) {
      await runWithTransaction(command);
      expect(commitTransaction).toHaveBeenCalled();
    } else {
      await expect(runWithTransaction(command)).rejects.toThrow();
      expect(commitTransaction).not.toHaveBeenCalled();
      expect(rollbackTransaction).toHaveBeenCalled();
    }
  });
});
