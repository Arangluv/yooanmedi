import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createProductFixture,
  MockProductRepository,
  ProductRepositoryMocks,
} from '@/entities/product/__test__';
import {
  EasyPayPaymentAuthenticationDto,
  EasyPayPaymentAuthenticationSchemas,
} from '@/entities/easypay';
import { Product } from '@/entities/product';
import { PaymentFixtures } from '../fixtures';
import { PaymentCommandHelper } from '../../infrastructure';
import { UserPaymentDto } from '../../schemas';
import { BankTransferPaymentRequestDto, PGPaymentRequestDto } from '../../dto';

describe('PaymentCommandHelper', () => {
  describe('toPaymentAuthResult', () => {
    it('FormData가 PaymentAuthResult로 파싱된다', () => {
      // Given
      const requestDto = PaymentFixtures.request.usePoint.pg;

      // When
      const result = PaymentCommandHelper.toPaymentAuthResult(requestDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentAuthenticationSchemas.dto));
    });
  });

  describe('createPGCommandDto', () => {
    let requestDto: PGPaymentRequestDto;
    let authResult: EasyPayPaymentAuthenticationDto;
    let repositoryProducts: Product[];
    let mockProductRepository: MockProductRepository;

    beforeEach(() => {
      requestDto = PaymentFixtures.request.usePoint.pg;
      authResult = PaymentCommandHelper.toPaymentAuthResult(requestDto);
      repositoryProducts = [
        createProductFixture({ id: 1, price: 3000 }),
        createProductFixture({ id: 2, price: 4000 }),
        createProductFixture({ id: 3, price: 5000 }),
      ];
      mockProductRepository = ProductRepositoryMocks.create();
    });

    it('command DTO가 생성된다', async () => {
      // Given
      vi.mocked(mockProductRepository.findMany).mockResolvedValue({
        products: repositoryProducts,
        totalCount: 3,
      });

      // When
      const commandDto = await PaymentCommandHelper.createPGCommandDto(
        authResult,
        mockProductRepository as any,
      );

      // Then
      expect(commandDto).toEqual(expect.schemaMatching(UserPaymentDto.command.pg));
    });

    it('dto orderList의 상품가격은 authResult가 반환한 상품가격으로 설정된다.', async () => {
      // Given
      vi.mocked(mockProductRepository.findMany).mockResolvedValue({
        products: repositoryProducts,
        totalCount: 3,
      });

      // When
      const commandDto = await PaymentCommandHelper.createPGCommandDto(
        authResult,
        mockProductRepository as any,
      );

      // Then
      const { orderList } = commandDto.paymentInfo;
      expect(orderList[0].product.price).not.toBe(repositoryProducts[0].price);
      expect(orderList[1].product.price).not.toBe(repositoryProducts[1].price);
      expect(orderList[2].product.price).not.toBe(repositoryProducts[2].price);
    });

    it('orderItem의 usedPoint 총합은 request의 usedPoint와 일치한다', async () => {
      // Given
      vi.mocked(mockProductRepository.findMany).mockResolvedValue({
        products: repositoryProducts,
        totalCount: 3,
      });

      // When
      const commandDto = await PaymentCommandHelper.createPGCommandDto(
        authResult,
        mockProductRepository as any,
      );

      // Then
      const { orderList } = commandDto.paymentInfo;
      const usedPointSum = orderList.reduce((acc, orderItem) => orderItem.usedPoint + acc, 0);

      expect(usedPointSum).toBe(authResult.usedPoint);
    });

    it('orderItem의 totalAmount 총합이 commandDto의 totalAmount와 일치한다', async () => {
      // Given
      vi.mocked(mockProductRepository.findMany).mockResolvedValue({
        products: repositoryProducts,
        totalCount: 3,
      });

      // When
      const commandDto = await PaymentCommandHelper.createPGCommandDto(
        authResult,
        mockProductRepository as any,
      );

      // Then
      const { orderList } = commandDto.paymentInfo;
      const orderItemPriceSum = orderList.reduce(
        (acc, orderItem) => orderItem.totalAmount + acc,
        0,
      );

      expect(orderItemPriceSum).toBe(commandDto.paymentInfo.totalAmount);
    });
  });

  describe('createBankTransferCommandDto', () => {
    let requestDto: BankTransferPaymentRequestDto;

    beforeEach(() => {
      requestDto = PaymentFixtures.request.usePoint.bank;
    });

    it('Command DTO로 파싱된다', () => {
      // When
      const commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);

      // Then
      expect(commandDto).toEqual(expect.schemaMatching(UserPaymentDto.command.bankTransfer));
    });

    it('orderItem의 usedPoint 총합은 request의 usedPoint와 일치한다', () => {
      // When
      const commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);

      // Then
      const { orderList } = commandDto.paymentInfo;
      const usedPointSum = orderList.reduce((acc, orderItem) => orderItem.usedPoint + acc, 0);

      expect(usedPointSum).toBe(requestDto.user.usedPoint);
    });

    it('orderItem의 totalAmount 총합이 commandDto의 totalAmount와 일치한다', () => {
      // When
      const commandDto = PaymentCommandHelper.createBankTransferCommandDto(requestDto);

      // Then
      const { orderList } = commandDto.paymentInfo;
      const orderItemPriceSum = orderList.reduce(
        (acc, orderItem) => orderItem.totalAmount + acc,
        0,
      );

      expect(orderItemPriceSum).toBe(commandDto.paymentInfo.totalAmount);
    });
  });
});
