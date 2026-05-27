import { UsePointTransactionService } from './use';
import { EarnPointTransactionService } from './earn';
import { CancelEarnPointTransactionService } from './cancel-earn';
import { CancelUsePointTransactionService } from './cancel-use';
import { PointTransactionApiRepository } from '../infrastructure';
import { POINT_ACTION } from '../constants';
import { IPointTransactionService } from '../core';

export class PointTransactionServiceFactory {
  static forUse(): IPointTransactionService {
    const repository = new PointTransactionApiRepository();
    return new UsePointTransactionService(repository, POINT_ACTION.use);
  }

  static forEarn(): IPointTransactionService {
    const repository = new PointTransactionApiRepository();
    return new EarnPointTransactionService(repository, POINT_ACTION.earn);
  }

  static forCancelUse(): IPointTransactionService {
    const repository = new PointTransactionApiRepository();
    return new CancelUsePointTransactionService(repository, POINT_ACTION.cancel_use);
  }

  static forCancelEarn(): IPointTransactionService {
    const repository = new PointTransactionApiRepository();
    return new CancelEarnPointTransactionService(repository, POINT_ACTION.cancel_earn);
  }
}
