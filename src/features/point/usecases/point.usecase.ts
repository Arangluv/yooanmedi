import { PointHistory } from '@/entities/point';
import { User } from '@/entities/user';
import {
  CreatePointRefundHistoryRequestDto,
  CreatePointUsageHistoryRequestDto,
  UpdateUserPointRequestDto,
} from '../dto';

export interface PointUsecase {
  createUsageHistory: (dto: CreatePointUsageHistoryRequestDto) => Promise<PointHistory>;
  createRefundHistory: (dto: CreatePointRefundHistoryRequestDto) => Promise<PointHistory>;
  updateUserPointByHistories: (dto: UpdateUserPointRequestDto) => Promise<User>;
}
