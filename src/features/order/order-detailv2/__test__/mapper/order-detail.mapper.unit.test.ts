import { describe, it, expect } from 'vitest';
import { OrderDetailFixtures } from '../fixtures';
import { OrderDetailMapper } from '../../mapper';
import { orderDetailSchema } from '../../schemas';

describe('OrderDetailMapper', () => {
  describe('responseToDto', () => {
    it('OrderDetailDto로 파싱된다', () => {
      // Given
      const response = OrderDetailFixtures.response;

      console.log(JSON.stringify(response, null, 2));
      try {
        // When
        const result = OrderDetailMapper.responseToDto(response);

        // Then
        expect(result).toEqual(expect.schemaMatching(orderDetailSchema));
      } catch (error) {
        console.log(error);
      }
    });
  });
});
