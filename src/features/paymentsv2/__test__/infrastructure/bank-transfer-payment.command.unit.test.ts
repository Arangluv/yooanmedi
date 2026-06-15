import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError } from '@/shared';
import { PaymentCommandHelper } from '../../infrastructure';
import { BankTransferPaymentCommand } from '../../infrastructure/command';
import { MockCommandDependencies } from '../mocks';
import { PaymentFixtures } from '../fixtures';

describe('BankTransferPaymentCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('무통장 입금 결제에 성공 후 transaction이 commit된다', async () => {
    // Given
    const requestDto = PaymentFixtures.request.bank;
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.bank.success;
    const commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockPayload.db.commitTransaction).toHaveBeenCalled();
    expect(mockPayload.db.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mockPayload.db.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('무통장 입금 결제 실패 시 BaseError를 throw한다', async () => {
    // Given
    const requestDto = PaymentFixtures.request.bank;
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.bank.fail;
    const commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow(BaseError);
  });

  it('무통장 입금 결제 실패 시 rollbackTransaction이 실행된다', async () => {
    // Given
    const requestDto = PaymentFixtures.request.bank;
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.bank.fail;
    const commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow();
    expect(mockPayload.db.commitTransaction).not.toHaveBeenCalled();
    expect(mockPayload.db.rollbackTransaction).toHaveBeenCalled();
    expect(mockPayload.db.rollbackTransaction).toHaveBeenCalledTimes(1);
  });
});
