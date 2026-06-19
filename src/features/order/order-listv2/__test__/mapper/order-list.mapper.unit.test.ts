import { describe, it, expect } from 'vitest';
import { OrderListResponseFixture } from '../fixtures';
import { OrderListMapper } from '../../mapper';
import { adminOrderListResultSchema, clientOrderListResultSchema } from '../../schemas';

describe('OrderListMapper', () => {
  describe('toAdminOrderListResult', () => {
    it('AdminOrderListResult를 반환한다', () => {
      // Given
      const response = OrderListResponseFixture.success.admin;

      // When
      const result = OrderListMapper.toAdminOrderListResult(response);

      // Then
      expect(result).toEqual(expect.schemaMatching(adminOrderListResultSchema));
    });
  });

  describe('toClientOrderListResult', () => {
    it('ClientOrderListResult를 반환한다', () => {
      // Given
      const response = OrderListResponseFixture.success.client;

      // When
      const result = OrderListMapper.toClientOrderListResult(response);

      // Then
      expect(result).toEqual(expect.schemaMatching(clientOrderListResultSchema));
    });
  });
});
