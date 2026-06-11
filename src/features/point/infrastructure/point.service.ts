import { LoggerV2 } from '@/shared';
import { UserRepository } from '@/entities/user';
import { POINT_ACTION, PointHistoryRepository } from '@/entities/point';
import {
  CreatePointRefundHistoryRequestDto,
  CreatePointUsageHistoryRequestDto,
  UpdateUserPointRequestDto,
} from '../dto';
import { PointFeatureMapper } from '../mapper';
import { PointUsecase } from '../usecases';
import {
  POINT_FEATURE_ERROR_MESSAGE,
  PointFeatureError,
  PointFindOption,
  UserPointResolver,
} from '../libs';

export interface PointServiceDependencies {
  repository: {
    user: UserRepository;
    point: PointHistoryRepository;
  };
}

export const PointService = ({ repository }: PointServiceDependencies): PointUsecase => ({
  createUsageHistory: async (dto: CreatePointUsageHistoryRequestDto) => {
    try {
      const domainDto = PointFeatureMapper.useageReqtoDomain(dto);
      return await repository.point.create(domainDto);
    } catch (error) {
      LoggerV2.error(error);
      throw PointFeatureError.create(POINT_FEATURE_ERROR_MESSAGE.createUsage);
    }
  },

  createRefundHistory: async (dto: CreatePointRefundHistoryRequestDto) => {
    try {
      const option =
        dto.rollbackType === POINT_ACTION.use
          ? PointFindOption.findOne.use(dto)
          : PointFindOption.findOne.earn(dto);
      const rollbackHistory = await repository.point.findOne(option);
      const domainDto = PointFeatureMapper.refundReqtoDomainRequestDto(dto, rollbackHistory.amount);
      return await repository.point.create(domainDto);
    } catch (error) {
      LoggerV2.error(error);
      throw PointFeatureError.create(POINT_FEATURE_ERROR_MESSAGE.createRefund);
    }
  },

  updateUserPointByHistories: async (dto: UpdateUserPointRequestDto) => {
    try {
      const user = await repository.user.findById(dto.user);
      const deltaPoint = dto.histories.reduce((acc, history) => acc + history.amount, 0);
      const updatedPoint = UserPointResolver.calcUpdatePoint({
        type: dto.type,
        currentPoint: user.point,
        deltaPoint,
      });

      if (updatedPoint < 0) {
        throw PointFeatureError.update('포인트 업데이트 amount가 0보다 작습니다');
      }

      const domainDto = PointFeatureMapper.toUserUpdateDto({ ...dto, amount: updatedPoint });
      return await repository.user.update(domainDto);
    } catch (error) {
      LoggerV2.error(error);
      throw PointFeatureError.update(POINT_FEATURE_ERROR_MESSAGE.createRefund);
    }
  },
});
