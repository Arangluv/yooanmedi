import { POINT_ACTION, PointAction, PointCalculator } from '@/entities/point';

export const UserPointResolver = {
  calcUpdatePoint: ({
    type,
    currentPoint,
    deltaPoint,
  }: {
    type: PointAction;
    currentPoint: number;
    deltaPoint: number;
  }): number => {
    switch (type) {
      case POINT_ACTION.use:
        return PointCalculator.pointUse(currentPoint, deltaPoint);
      case POINT_ACTION.earn:
        return PointCalculator.pointEarn(currentPoint, deltaPoint);
      case POINT_ACTION.cancel_use:
        return PointCalculator.cancelUsePoint(currentPoint, deltaPoint);
      case POINT_ACTION.cancel_earn:
        return PointCalculator.cancelEarnPoint(currentPoint, deltaPoint);
    }
  },
};
