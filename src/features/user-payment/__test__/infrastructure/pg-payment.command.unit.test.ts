import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError } from '@/shared';
import { PaymentCommandHelper } from '../../infrastructure';
import { PGPaymentCommand } from '../../infrastructure/command';
import { MockCommandDependencies } from '../mocks';
import { PaymentFixtures } from '../fixtures';
import {
  ProductRepositoryMocks,
  MockProductRepository,
  createProductFixture,
} from '@/entities/product/__test__';
import { ProductRepository } from '@/entities/product';

describe('PGPaymentCommand', () => {
  const mockProductRepository = ProductRepositoryMocks.create() as MockProductRepository;

  beforeEach(() => {
    vi.mocked(mockProductRepository.findMany).mockResolvedValue({
      products: [
        createProductFixture({ id: 1, price: 16500 }),
        createProductFixture({ id: 2, price: 12500 }),
        createProductFixture({ id: 3, price: 45845 }),
      ],
      totalCount: 3,
    });

    vi.clearAllMocks();
  });

  it('PG 결제에 성공 후 transaction이 commit된다', async () => {
    // Given
    const requestDto = PaymentFixtures.request.pg;
    const { payload: mockPayload, repository: mockRepositories } =
      MockCommandDependencies.pg.success;
    const paymentAuthResult = PaymentCommandHelper.toPaymentAuthResult(requestDto);
    const commandDto = await PaymentCommandHelper.createPGCommandDto(
      paymentAuthResult,
      mockProductRepository as unknown as ProductRepository,
    );

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
    const requestDto = PaymentFixtures.request.pg;
    const { payload: mockPayload, repository: mockRepositories } = MockCommandDependencies.pg.fail;
    const paymentAuthResult = PaymentCommandHelper.toPaymentAuthResult(requestDto);
    const commandDto = await PaymentCommandHelper.createPGCommandDto(
      paymentAuthResult,
      mockProductRepository as unknown as ProductRepository,
    );

    const command = new PGPaymentCommand(commandDto, {
      payload: mockPayload,
      repository: mockRepositories,
    });

    // When & Then
    await expect(() => command.execute()).rejects.toThrow(BaseError);
  });

  it('PG 결제에 실패 시 rollbackTransaction이 실행된다', async () => {
    // Given
    const requestDto = PaymentFixtures.request.pg;
    const { payload: mockPayload, repository: mockRepositories } = MockCommandDependencies.pg.fail;
    const paymentAuthResult = PaymentCommandHelper.toPaymentAuthResult(requestDto);
    const commandDto = await PaymentCommandHelper.createPGCommandDto(
      paymentAuthResult,
      mockProductRepository as unknown as ProductRepository,
    );

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
