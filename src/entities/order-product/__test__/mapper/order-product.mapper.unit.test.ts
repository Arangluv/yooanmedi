import { describe, it, expect } from 'vitest';
import { baseOrderProductEntityFixture, createOrderProductEntityFixture } from '../fixtures';
import { OrderProductMapper } from '../../mapper';
import { orderProductSchema, orderProductsSchema } from '../../schemas';
import { OrderProductEntity } from '../../types';
import { BaseError } from '@/shared';

describe('OrderProduct Mapper', () => {
  describe('responseToDto', () => {
    it('파싱에 성공한다', () => {
      // Given
      const data = baseOrderProductEntityFixture;

      // When
      const result = OrderProductMapper.reponseToDto(data);

      // Then
      expect(result).toEqual(expect.schemaMatching(orderProductSchema));
    });

    it('실패 시 BaseError를 throw한다.', () => {
      // Given
      const data = { name: 'invalid' } as any;

      // When & Then
      expect(() => OrderProductMapper.reponseToDto(data)).toThrow(BaseError);
    });
  });

  describe('responseToDtoList', () => {
    it('파싱에 성공한다', () => {
      // Given
      const data = [
        createOrderProductEntityFixture({ id: 1 }),
        createOrderProductEntityFixture({ id: 2 }),
        createOrderProductEntityFixture({ id: 3 }),
      ] as OrderProductEntity[];

      // When
      const result = OrderProductMapper.reponseToDtoList(data);

      // Then
      expect(result).toEqual(expect.schemaMatching(orderProductsSchema));
    });

    it('실패 시 BaseError를 throw한다.', () => {
      // Given
      const data = [{ name: 'invalid' }, createOrderProductEntityFixture()] as any;

      // When & Then
      expect(() => OrderProductMapper.reponseToDtoList(data)).toThrow(BaseError);
    });
  });
});
