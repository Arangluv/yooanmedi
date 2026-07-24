import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { ORDER_STATUS } from '@/entities/order';
import { OrderListSearchParamsFixtures } from '../fixtures';
import { OrderListSearchParamsGenerator } from '../../infrastructure';

describe('OrderListSearchParamsGenerator', () => {
  describe('getAdminSafeSearchParams', () => {
    it('기본 URL이 주어진 경우 default value로 파싱된다', async () => {
      // Given
      const searchParms = OrderListSearchParamsFixtures.admin.default;

      // When
      const result = await OrderListSearchParamsGenerator.getAdminSafeSearchParams(searchParms);

      // Then
      expect(result).toMatchObject({
        orderStatus: null,
        page: 1,
      });
    });

    it('페이지가 number로 파싱된다', async () => {
      // Given
      const searchParms = OrderListSearchParamsFixtures.admin.withQuries;

      // When
      const result = await OrderListSearchParamsGenerator.getAdminSafeSearchParams(searchParms);

      // Then
      expect(typeof result.page).toBe('number');
    });

    it('orderStatus로 파싱된다', async () => {
      // Given
      const searchParms = OrderListSearchParamsFixtures.admin.withQuries;

      // When
      const result = await OrderListSearchParamsGenerator.getAdminSafeSearchParams(searchParms);

      // Then
      expect(result.orderStatus).toBe(ORDER_STATUS.pending);
    });

    it('올바르지 않은 쿼리가 주어진 경우 default value로 파싱된다', async () => {
      // Given
      const searchParms = OrderListSearchParamsFixtures.admin.invalidParams;

      // When
      const result = await OrderListSearchParamsGenerator.getAdminSafeSearchParams(searchParms);

      // Then
      expect(result).toMatchObject({
        orderStatus: null,
        page: 1,
      });
    });
  });

  describe('getClientSafeSearchParams', () => {
    const defaultSearchParams = {
      from: dayjs().subtract(7, 'days').format('YYYYMMDD'),
      to: dayjs().format('YYYYMMDD'),
      keyword: null,
      orderStatus: null,
    };

    it('기본 URL이 주어진 경우 default value로 파싱된다', async () => {
      // Given
      const searchParms = OrderListSearchParamsFixtures.client.default;

      // When
      const result = await OrderListSearchParamsGenerator.getClientSafeSearchParams(searchParms);

      // Then
      expect(result).toMatchObject(defaultSearchParams);
    });

    it('쿼리가 주어진 경우 해당쿼리로 파싱된다', async () => {
      // Given
      const searchParms = OrderListSearchParamsFixtures.client.withQuries;

      // When
      const result = await OrderListSearchParamsGenerator.getClientSafeSearchParams(searchParms);

      // Then
      expect(result.from).toBe((await searchParms).from);
      expect(result.to).toBe((await searchParms).to);
      expect(result.orderStatus).toBe((await searchParms).orderStatus);
      expect(result.keyword).toBe((await searchParms).keyword);
    });

    /**
     * https://nuqs.dev/docs/parsers/making-your-own
     * 해당 테스트는 실패합니다. from, to query에 대해 custom parser를 만들고
     * 잘못된 query가 전달되면 기본 from, to로 대응되도록 코드를 작성해야합니다
     */
    it.todo('올바르지 않은 쿼리가 주어진 경우 default value로 파싱된다', async () => {
      const searchParms = OrderListSearchParamsFixtures.client.invalidParams;

      // When
      const result = await OrderListSearchParamsGenerator.getClientSafeSearchParams(searchParms);

      // Then
      expect(result).toMatchObject(defaultSearchParams);
    });
  });
});
