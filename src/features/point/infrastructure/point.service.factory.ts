import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { PointService } from './point.service';
import {
  PointTransactionAdapter,
  PointTransactionApiRepository,
} from '@/entities/point/infrastructure';

export const createPointService = () => {
  const userRepository = new UserApiRepository(UserAdapter());
  const pointRepository = new PointTransactionApiRepository(PointTransactionAdapter());

  return PointService({
    repository: {
      user: userRepository,
      point: pointRepository,
    },
  });
};
