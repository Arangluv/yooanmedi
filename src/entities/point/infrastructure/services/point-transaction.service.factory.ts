import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { UsePointTransactionService } from './use';
import { EarnPointTransactionService } from './earn';
import { CancelEarnPointTransactionService } from './cancel-earn';
import { CancelUsePointTransactionService } from './cancel-use';
import { PointTransactionApiRepository } from '../repository';
import { PointTransactionAdapter } from '../api';
import { IPointTransactionService } from '../../core';

export class PointTransactionServiceFactory {
  static forUse(): IPointTransactionService {
    const pointTransactionRepository = new PointTransactionApiRepository(PointTransactionAdapter());
    const userApiRepository = new UserApiRepository(UserAdapter());

    return new UsePointTransactionService(pointTransactionRepository, userApiRepository);
  }

  static forEarn(): IPointTransactionService {
    const pointTransactionRepository = new PointTransactionApiRepository(PointTransactionAdapter());
    const userApiRepository = new UserApiRepository(UserAdapter());

    return new EarnPointTransactionService(pointTransactionRepository, userApiRepository);
  }

  static forCancelUse(): IPointTransactionService {
    const pointTransactionRepository = new PointTransactionApiRepository(PointTransactionAdapter());
    const userApiRepository = new UserApiRepository(UserAdapter());

    return new CancelUsePointTransactionService(pointTransactionRepository, userApiRepository);
  }

  static forCancelEarn(): IPointTransactionService {
    const pointTransactionRepository = new PointTransactionApiRepository(PointTransactionAdapter());
    const userApiRepository = new UserApiRepository(UserAdapter());

    return new CancelEarnPointTransactionService(pointTransactionRepository, userApiRepository);
  }
}
