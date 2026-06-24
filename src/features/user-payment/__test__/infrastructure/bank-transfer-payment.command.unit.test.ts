import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError } from '@/shared';
import { PaymentCommandHelper } from '../../infrastructure';
import {
  BankTransferCommandDependencies,
  BankTransferPaymentCommand,
} from '../../infrastructure/command';
import { MockCommandDependencies } from '../mocks';
import { PaymentFixtures } from '../fixtures';
import { BankTransferPaymentCommandDto, BankTransferPaymentRequestDto } from '../../dto';
import { BasePayload } from 'payload';

describe('BankTransferPaymentCommand', () => {
  let requestDto: BankTransferPaymentRequestDto;
  let mockPayload: BasePayload;
  let mockRepositories: BankTransferCommandDependencies['repository'];
  let commandDto: BankTransferPaymentCommandDto;

  beforeEach(() => {
    requestDto = PaymentFixtures.request.usePoint.bank;
    const { payload, repository } = MockCommandDependencies.bank.success;
    mockPayload = payload;
    mockRepositories = repository;

    commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);

    vi.clearAllMocks();
  });

  it('주문이 생성된다', async () => {
    // Given
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockRepositories.order.create).toHaveBeenCalledTimes(1);
  });

  it('주문상품 / 최근구매내역 / 포인트 사용 히스토리가 생성된다', async () => {
    // Given
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    const callTimes = commandDto.paymentInfo.orderList.length;
    expect(mockRepositories.orderProduct.create).toHaveBeenCalledTimes(callTimes);
    expect(mockRepositories.pointHistory.createUsageHistory).toHaveBeenCalledTimes(callTimes);
    expect(mockRepositories.purchasedHistory.create).toHaveBeenCalledTimes(callTimes);
  });

  it('유저의 포인트가 차감된다', async () => {
    // Given
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockRepositories.user.update).toHaveBeenCalledTimes(1);
  });

  it('결제 성공 후 트랜젝션이 commit된다', async () => {
    // Given
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockPayload.db.commitTransaction).toHaveBeenCalled();
    expect(mockPayload.db.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('무통장 입금 결제 실패 시 BaseError를 throw한다', async () => {
    // Given
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.bank.fail;
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow(BaseError);
  });

  it('무통장 입금 결제 실패 시 rollbackTransaction이 실행된다', async () => {
    // Given
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.bank.fail;
    const command = new BankTransferPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow();
    expect(mockPayload.db.rollbackTransaction).toHaveBeenCalled();
    expect(mockPayload.db.commitTransaction).not.toHaveBeenCalled();
  });
});
