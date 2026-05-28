import { UsePointTransactionService } from './use';
import { EarnPointTransactionService } from './earn';
import { CancelEarnPointTransactionService } from './cancel-earn';
import { CancelUsePointTransactionService } from './cancel-use';
import { PointTransactionApiRepository } from '..';
import { PointTransactionAdapter } from '..';
import { IPointTransactionService } from '../../core';

export class PointTransactionServiceFactory {
  static forUse(): IPointTransactionService {
    const repository = new PointTransactionApiRepository(PointTransactionAdapter());
    return new UsePointTransactionService(repository);
  }

  static forEarn(): IPointTransactionService {
    const repository = new PointTransactionApiRepository(PointTransactionAdapter());
    return new EarnPointTransactionService(repository);
  }

  static forCancelUse(): IPointTransactionService {
    const repository = new PointTransactionApiRepository(PointTransactionAdapter());
    return new CancelUsePointTransactionService(repository);
  }

  static forCancelEarn(): IPointTransactionService {
    const repository = new PointTransactionApiRepository(PointTransactionAdapter());
    return new CancelEarnPointTransactionService(repository);
  }
}
