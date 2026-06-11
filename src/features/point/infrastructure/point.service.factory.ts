import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { PointService } from './point.service';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';

export const createPointService = () => {
  const userRepository = new UserApiRepository(UserAdapter());
  const pointRepository = new PointHistoryApiRepository(PointHistoryAdapter());

  return PointService({
    repository: {
      user: userRepository,
      point: pointRepository,
    },
  });
};
