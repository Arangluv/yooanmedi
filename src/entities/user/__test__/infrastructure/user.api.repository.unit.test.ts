import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserApiRepository } from '../../infrastructure/repository';
import { MockUserAdapter } from '../mocks';
import { PayloadAdapterResult } from '@/shared/server';
import { BaseError, FindOption } from '@/shared';
import { userSchema } from '../../schemas';
import { baseUserResponseFixture, createUserResponseFixture } from '../fixtures';
import { UserAdapter } from '../../infrastructure/api';
import { UpdateUserDto } from '../../dto';

describe('User Api Repository', () => {
  let userApiRepository: UserApiRepository;
  let mockUserAdapter: ReturnType<typeof MockUserAdapter>;
  let successAdapterUserResponse: PayloadAdapterResult;
  let failAdapterUserResponse: PayloadAdapterResult;

  beforeEach(() => {
    mockUserAdapter = MockUserAdapter();
    userApiRepository = new UserApiRepository(mockUserAdapter);
    successAdapterUserResponse = {
      ok: true,
      data: baseUserResponseFixture,
    };
    failAdapterUserResponse = {
      ok: false,
      error: new BaseError({
        clientMsg: 'Test Error',
        errorName: 'TestErrorFailError',
      }),
    };
  });

  describe('findById', () => {
    it('유저 정보를 가져오는데 성공한다', async () => {
      // Given
      const targetUserId = 3;
      vi.mocked(mockUserAdapter.getUserById).mockResolvedValue(successAdapterUserResponse);

      // When
      const result = await userApiRepository.findById(targetUserId);

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('유저 정보를 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const targetUserId = 3;
      vi.mocked(mockUserAdapter.getUserById).mockResolvedValue(failAdapterUserResponse);

      // When & Then
      await expect(() => userApiRepository.findById(targetUserId)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('유저 리스트를 가져오는데 성공한다', async () => {
      // Given
      const option = {} as FindOption;
      const mockSuccessResult = {
        ok: true,
        data: [
          createUserResponseFixture(),
          createUserResponseFixture(),
          createUserResponseFixture(),
        ],
      } as PayloadAdapterResult;
      vi.mocked(mockUserAdapter.getUserList.mockResolvedValue(mockSuccessResult));
      // When
      const result = await userApiRepository.findMany(option);

      // Then
      expect(result).instanceOf(Array);
      expect(result.length).toBe(3);
      expect(result[0]).toEqual(expect.schemaMatching(userSchema));
    });

    it('User Adapter의 data가 빈 배열인 경우, 빈 배열을 반환한다', async () => {
      // Given
      const option = {} as FindOption;
      const mockSuccessResult = {
        ok: true,
        data: [],
      } as PayloadAdapterResult;
      vi.mocked(mockUserAdapter.getUserList.mockResolvedValue(mockSuccessResult));

      // When
      const result = await userApiRepository.findMany(option);

      // Then
      expect(result).instanceOf(Array);
      expect(result.length).toBe(0);
    });

    it('유저 리스트를 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockUserAdapter.getUserList).mockResolvedValue(failAdapterUserResponse);

      // When & Then
      await expect(() => userApiRepository.findMany(option)).rejects.toThrow(BaseError);
    });
  });

  describe('updateUser', () => {
    it('유저 업데이트에 성공하고, 유저를 반환한다', async () => {
      // Given
      const updateDto = {
        user: 3,
        data: {
          point: 300,
        },
      } as UpdateUserDto;
      vi.mocked(mockUserAdapter.updateUser.mockResolvedValue(successAdapterUserResponse));

      // When
      const result = await userApiRepository.update(updateDto);

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('유저 업데이트에 실패하면 BaseError를 throw한다', async () => {
      // Given
      const updateDto = {
        user: 3,
        data: {
          point: 300,
        },
      } as UpdateUserDto;
      vi.mocked(mockUserAdapter.updateUser.mockResolvedValue(failAdapterUserResponse));

      // When & Then
      await expect(() => userApiRepository.update(updateDto)).rejects.toThrow(BaseError);
    });
  });
});
