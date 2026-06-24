import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError } from '@/shared';
import { PaymentCommandHelper } from '../../infrastructure';
import { PGPaymentCommand, PGPaymentCommandDependencies } from '../../infrastructure/command';
import { MockCommandDependencies } from '../mocks';
import { PaymentFixtures } from '../fixtures';
import {
  ProductRepositoryMocks,
  MockProductRepository,
  createProductFixture,
} from '@/entities/product/__test__';
import { ProductRepository } from '@/entities/product';
import { PGPaymentCommandDto, PGPaymentRequestDto } from '../../dto';
import { BasePayload } from 'payload';

describe('PGPaymentCommand', () => {
  const mockProductRepository = ProductRepositoryMocks.create() as MockProductRepository;
  let requestDto: PGPaymentRequestDto;
  let mockPayload: BasePayload;
  let mockRepositories: PGPaymentCommandDependencies['repository'];
  let commandDto: PGPaymentCommandDto;

  beforeEach(async () => {
    vi.mocked(mockProductRepository.findMany).mockResolvedValue({
      products: [
        createProductFixture({ id: 1, price: 16500 }),
        createProductFixture({ id: 2, price: 12500 }),
        createProductFixture({ id: 3, price: 45845 }),
      ],
      totalCount: 3,
    });

    requestDto = PaymentFixtures.request.usePoint.pg;
    const { payload, repository } = MockCommandDependencies.pg.success;
    mockPayload = payload;
    mockRepositories = repository;

    const paymentAuthResult = PaymentCommandHelper.toPaymentAuthResult(requestDto);
    commandDto = await PaymentCommandHelper.createPGCommandDto(
      paymentAuthResult,
      mockProductRepository as unknown as ProductRepository,
    );

    vi.clearAllMocks();
  });

  it('주문이 생성된다', async () => {
    // Given
    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockRepositories.order.create).toHaveBeenCalledTimes(1);
  });

  it('주문상품 / 최근구매내역 / 포인트 적립 / 포인트 사용 히스토리가 생성된다', async () => {
    // Given
    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    const callTimes = commandDto.paymentInfo.orderList.length;
    expect(mockRepositories.orderProduct.create).toHaveBeenCalledTimes(callTimes);
    expect(mockRepositories.pointHistory.createUsageHistory).toHaveBeenCalledTimes(callTimes * 2);
    expect(mockRepositories.purchasedHistory.create).toHaveBeenCalledTimes(callTimes);
  });

  it('유저의 포인트가 차감된다', async () => {
    // Given
    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockRepositories.user.update).toHaveBeenCalledTimes(2);
  });

  it('결제 승인 요청을 성공한다', async () => {
    // Given
    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockRepositories.easyPay.approvePayment).toHaveBeenCalledTimes(1);
  });

  it('결제내역 히스토리를 생성한다', async () => {
    // Given
    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When
    await command.execute();

    // Then
    expect(mockRepositories.paymentHistory.create).toHaveBeenCalledTimes(1);
  });

  it('PG 결제에 성공 후 transaction이 commit된다', async () => {
    // Given
    const command = new PGPaymentCommand(commandDto, {
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

  it('PG 결제에 실패 시 BaseError를 throw한다', async () => {
    // Given
    const { payload, repository } = MockCommandDependencies.pg.fail;
    const command = new PGPaymentCommand(commandDto, {
      payload,
      repository,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow(BaseError);
  });

  it('PG 결제에 실패 시 전체 결제취소 요청이 실행된다', async () => {
    // Given
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.pg.totalCancelCase;
    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow();
    expect(mockRepositories.easyPay.totalCancel).toHaveBeenCalledTimes(1);
  });

  it('PG 결제에 실패 시 rollbackTransaction이 실행된다', async () => {
    // Given
    const { payload: mockPayload, repository: mockRepositories } = MockCommandDependencies.pg.fail;
    const command = new PGPaymentCommand(commandDto, {
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
