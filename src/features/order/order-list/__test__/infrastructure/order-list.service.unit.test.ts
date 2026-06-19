import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepositoryMocks } from '@/entities/user/__test__';
import { OrderListRepositoryMocks } from '../mocks';
import { OrderListService, OrderListServiceDependencies } from '../../infrastructure';
import { GetAdminOrderListRequestDto, GetClientOrderListRequestDto } from '../../dto';

describe('OrderListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAdminOrderList', () => {
    it('주문 리스트를 가져온다', async () => {
      // Given
      const mockOrderListRepository = OrderListRepositoryMocks.createSuccess();
      const { getAdminOrderList } = OrderListService({
        repository: {
          orderList: mockOrderListRepository,
          user: UserRepositoryMocks.createSuccess(),
        },
      } as OrderListServiceDependencies);
      const dto = {} as GetAdminOrderListRequestDto;

      // When
      await getAdminOrderList(dto);

      // Then
      expect(mockOrderListRepository.findMandForAdmin).toHaveBeenCalledTimes(1);
    });
  });

  describe('getClientOrderList', () => {
    it('주문 리스트를 가져온다', async () => {
      // Given
      const mockOrderListRepository = OrderListRepositoryMocks.createSuccess();
      const { getClientOrderList } = OrderListService({
        repository: {
          orderList: mockOrderListRepository,
          user: UserRepositoryMocks.createSuccess(),
        },
      } as OrderListServiceDependencies);
      const dto = {} as GetClientOrderListRequestDto;

      // When
      await getClientOrderList(dto);

      // Then
      expect(mockOrderListRepository.findMandForClient).toHaveBeenCalledTimes(1);
    });
  });
});
