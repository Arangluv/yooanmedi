import { PointTransaction } from '@/entities/point';
import { User } from '@/entities/user';
import {
  CreatePointRefundHistoryRequestDto,
  CreatePointUsageHistoryRequestDto,
  UpdateUserPointRequestDto,
} from '../dto';

export interface PointUsecase {
  createUsageHistory: (dto: CreatePointUsageHistoryRequestDto) => Promise<PointTransaction>;
  createRefundHistory: (dto: CreatePointRefundHistoryRequestDto) => Promise<PointTransaction>;
  updateUserPointByHistories: (dto: UpdateUserPointRequestDto) => Promise<User>;
}
